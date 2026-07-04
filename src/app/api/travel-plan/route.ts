import { NextResponse } from "next/server";
import { generateTravelPlan } from "@/lib/generate-plan";
import { travelPreferencesSchema } from "@/lib/validation";
import type { TravelPlan, TravelPreferences } from "@/types/travel";

type AiPlanBody = Pick<
  TravelPlan,
  | "topAttractions"
  | "hiddenGems"
  | "localFoods"
  | "culturalExperiences"
  | "festivals"
  | "itinerary"
  | "tips"
  | "estimatedBudget"
  | "story"
>;

const planBodySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "topAttractions",
    "hiddenGems",
    "localFoods",
    "culturalExperiences",
    "festivals",
    "itinerary",
    "tips",
    "estimatedBudget",
    "story"
  ],
  properties: {
    topAttractions: stringArraySchema("Famous destination-specific attractions."),
    hiddenGems: stringArraySchema("Lesser-known authentic local places."),
    localFoods: stringArraySchema("Local dishes, snacks, drinks, or market foods."),
    culturalExperiences: stringArraySchema("Authentic cultural and heritage experiences."),
    festivals: stringArraySchema("Local events, seasonal festivals, markets, or performances."),
    itinerary: stringArraySchema("Day-by-day itinerary entries."),
    tips: stringArraySchema("Practical, respectful travel tips."),
    estimatedBudget: {
      type: "string",
      description: "A concise budget estimate for the trip."
    },
    story: {
      type: "string",
      description: "An immersive 150-220 word cultural story for the destination."
    }
  }
};

function stringArraySchema(description: string) {
  return {
    type: "array",
    description,
    minItems: 3,
    maxItems: 8,
    items: { type: "string" }
  };
}

function getGeneratedText(responseBody: unknown) {
  if (!responseBody || typeof responseBody !== "object") {
    return null;
  }

  if ("output_text" in responseBody && typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  const output = "output" in responseBody && Array.isArray(responseBody.output) ? responseBody.output : [];
  const textParts = output.flatMap((item: unknown) => {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
      return [];
    }

    return item.content
      .map((contentItem: unknown) =>
        contentItem && typeof contentItem === "object" && "text" in contentItem
          ? contentItem.text
          : null
      )
      .filter((text: unknown): text is string => typeof text === "string");
  });

  return textParts.join("\n").trim() || null;
}

function buildPlanId(preferences: TravelPreferences, destination: string) {
  return `${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${preferences.duration}-${preferences.budget}`;
}

function withChecklist(preferences: TravelPreferences, body: AiPlanBody): TravelPlan {
  const fallback = generateTravelPlan(preferences);

  return {
    ...body,
    id: buildPlanId(preferences, fallback.destination),
    destination: fallback.destination,
    checklist: fallback.checklist
  };
}

async function generateWithOpenAI(preferences: TravelPreferences) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You create culturally respectful destination discovery guides. Recommend real-feeling attractions, hidden gems, heritage experiences, local events, foods, practical tips, and immersive storytelling. Avoid unsafe claims and keep the output concise."
        },
        {
          role: "user",
          content: `Create a culture-first travel plan for ${preferences.destination}. Budget: ${preferences.budget}. Duration: ${preferences.duration} days. Travel style: ${preferences.travelStyle}. Interests: ${preferences.interests.join(", ")}.`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "culture_compass_plan",
          schema: planBodySchema,
          strict: true
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error("AI provider request failed.");
  }

  const responseBody = (await response.json()) as unknown;
  const generatedText = getGeneratedText(responseBody);

  if (!generatedText) {
    throw new Error("AI provider returned an empty response.");
  }

  return withChecklist(preferences, JSON.parse(generatedText) as AiPlanBody);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = travelPreferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Check your trip details and try again." },
        { status: 400 }
      );
    }

    try {
      const aiPlan = await generateWithOpenAI(parsed.data);

      return NextResponse.json({ plan: aiPlan ?? generateTravelPlan(parsed.data) });
    } catch {
      return NextResponse.json({ plan: generateTravelPlan(parsed.data) });
    }
  } catch {
    return NextResponse.json(
      { error: "We could not read your travel preferences. Please check the form and try again." },
      { status: 400 }
    );
  }
}

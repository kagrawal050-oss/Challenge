import rawTravelData from "@/data/travel-data.json";
import type { Interest, TravelPlan, TravelPreferences } from "@/types/travel";
import { toTitleCase } from "@/lib/utils";

type TravelData = typeof rawTravelData;

const travelData = rawTravelData as TravelData;

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function makeChecklistItem(id: string, label: string) {
  return { id, label };
}

function buildItinerary(preferences: TravelPreferences, destination: string) {
  const days = Math.min(preferences.duration, 7);

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    if (day === 1) {
      return `Day ${day}: Arrive in ${destination}, explore the central neighborhood, try a local meal, and take a relaxed evening walk.`;
    }

    if (preferences.interests.includes("Nature") && day % 2 === 0) {
      return `Day ${day}: Start with a nature escape, visit a scenic viewpoint, and end with a calm cafe or market stop.`;
    }

    if (preferences.interests.includes("History")) {
      return `Day ${day}: Follow a heritage route through museums, historic streets, and a guided cultural stop.`;
    }

    return `Day ${day}: Mix one headline attraction with a hidden gem, local food tasting, and flexible time for ${preferences.travelStyle.toLowerCase()} travel.`;
  });
}

function buildStory(destination: string, interests: Interest[]) {
  const interestLine = interests
    .slice(0, 3)
    .map((interest) => interest.toLowerCase())
    .join(", ");

  return `${destination} opens slowly, like a handwritten map unfolding at breakfast. In the morning, shopkeepers lift their shutters while the scent of spices, bread, or roasted coffee drifts into narrow streets. Every corner carries a trace of the people who shaped it: traders, artists, families, pilgrims, and storytellers who left songs, recipes, rituals, and weathered buildings behind. As you move through markets and old squares, the destination feels less like a checklist and more like a conversation. Locals point you toward a favorite snack, a quiet courtyard, or a festival stage being prepared for music after sunset. The history is not sealed behind glass; it is alive in greetings, textiles, meals, and the rhythm of daily life. With your interests in ${interestLine || "culture"}, this trip becomes a chance to notice the small traditions that make ${destination} memorable: how people gather, celebrate, cook, remember, and welcome visitors into the story.`;
}

export function generateTravelPlan(preferences: TravelPreferences): TravelPlan {
  const destination = toTitleCase(preferences.destination);
  const foods = preferences.interests.flatMap((interest) => travelData.foodsByInterest[interest] ?? []);
  const experiences = preferences.interests.flatMap(
    (interest) => travelData.experiencesByInterest[interest] ?? []
  );

  return {
    id: `${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${preferences.duration}-${preferences.budget}`,
    destination,
    topAttractions: travelData.defaultAttractions.map((item) => `${destination} ${item}`),
    hiddenGems: travelData.defaultHiddenGems,
    localFoods: unique(foods).slice(0, 6),
    culturalExperiences: unique(experiences).slice(0, 6),
    festivals: travelData.festivals,
    itinerary: buildItinerary(preferences, destination),
    tips: travelData.tips,
    estimatedBudget: `${travelData.budgetRanges[preferences.budget]} for ${preferences.duration} day${preferences.duration > 1 ? "s" : ""}, excluding international flights.`,
    story: buildStory(destination, preferences.interests),
    checklist: {
      documents: [
        makeChecklistItem("passport", "Passport or government ID"),
        makeChecklistItem("tickets", "Flight, train, or hotel confirmations"),
        makeChecklistItem("insurance", "Travel insurance details"),
        makeChecklistItem("copies", "Printed and digital document copies")
      ],
      clothes: [
        makeChecklistItem("layers", "Weather-appropriate layers"),
        makeChecklistItem("shoes", "Comfortable walking shoes"),
        makeChecklistItem("occasion", "One smart outfit for cultural evenings"),
        makeChecklistItem("laundry", "Laundry pouch")
      ],
      medicines: [
        makeChecklistItem("prescriptions", "Prescription medicines"),
        makeChecklistItem("first-aid", "Basic first-aid kit"),
        makeChecklistItem("motion", "Motion sickness or digestion support"),
        makeChecklistItem("sanitizer", "Hand sanitizer")
      ],
      essentials: [
        makeChecklistItem("charger", "Chargers and power bank"),
        makeChecklistItem("adapter", "Universal travel adapter"),
        makeChecklistItem("bottle", "Reusable water bottle"),
        makeChecklistItem("cash", "Small local cash reserve")
      ]
    }
  };
}

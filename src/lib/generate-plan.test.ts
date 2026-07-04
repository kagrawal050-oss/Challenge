import { describe, expect, it } from "vitest";
import { generateTravelPlan } from "@/lib/generate-plan";

describe("generateTravelPlan", () => {
  it("generates a culture-rich travel plan aligned to the problem statement", () => {
    const plan = generateTravelPlan({
      destination: "japan",
      budget: "Medium",
      duration: 3,
      travelStyle: "Couple",
      interests: ["Nature", "Culture"]
    });

    expect(plan.destination).toBe("Japan");
    expect(plan.topAttractions).toHaveLength(5);
    expect(plan.hiddenGems.length).toBeGreaterThanOrEqual(3);
    expect(plan.culturalExperiences.join(" ")).toContain("folk performance");
    expect(plan.festivals.length).toBeGreaterThanOrEqual(3);
    expect(plan.itinerary).toHaveLength(3);
    expect(plan.story.length).toBeGreaterThan(400);
    expect(plan.checklist.documents.length).toBeGreaterThan(0);
  });

  it("caps generated itineraries at seven days for readability", () => {
    const plan = generateTravelPlan({
      destination: "Kyoto",
      budget: "High",
      duration: 30,
      travelStyle: "Family",
      interests: ["History"]
    });

    expect(plan.itinerary).toHaveLength(7);
  });
});

import { describe, expect, it } from "vitest";
import { getPreferencesFromSearchParams } from "@/lib/query-preferences";

describe("getPreferencesFromSearchParams", () => {
  it("normalizes lowercase shareable plan URL parameters", () => {
    const preferences = getPreferencesFromSearchParams(
      new URLSearchParams("destination=Japan&budget=medium&duration=3&travelStyle=couple&interests=Nature")
    );

    expect(preferences).toEqual({
      destination: "Japan",
      budget: "Medium",
      duration: 3,
      travelStyle: "Couple",
      interests: ["Nature"]
    });
  });

  it("uses safe defaults when optional query values are missing", () => {
    const preferences = getPreferencesFromSearchParams(new URLSearchParams("destination=Lisbon"));

    expect(preferences.budget).toBe("Medium");
    expect(preferences.duration).toBe(3);
    expect(preferences.travelStyle).toBe("Couple");
    expect(preferences.interests).toEqual(["Culture"]);
  });
});

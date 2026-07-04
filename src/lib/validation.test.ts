import { describe, expect, it } from "vitest";
import { travelPreferencesSchema } from "@/lib/validation";

describe("travelPreferencesSchema", () => {
  it("accepts a complete culture travel request", () => {
    const parsed = travelPreferencesSchema.safeParse({
      destination: "Japan",
      budget: "Medium",
      duration: 3,
      travelStyle: "Couple",
      interests: ["Nature", "Culture"]
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid or unsafe form values", () => {
    const parsed = travelPreferencesSchema.safeParse({
      destination: "<script>",
      budget: "medium",
      duration: 0,
      travelStyle: "couple",
      interests: []
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.length).toBeGreaterThanOrEqual(1);
    }
  });
});

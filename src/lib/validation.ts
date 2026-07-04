import { z } from "zod";
import { budgets, interests, travelStyles } from "@/types/travel";

export const travelPreferencesSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(2, "Enter a destination with at least 2 characters.")
    .max(80, "Destination must be 80 characters or less.")
    .regex(/^[\p{L}\p{N}\s,.'-]+$/u, "Use letters, numbers, spaces, commas, periods, or hyphens."),
  budget: z.enum(budgets),
  duration: z.coerce
    .number()
    .int("Trip duration must be a whole number.")
    .min(1, "Trip duration must be at least 1 day.")
    .max(30, "Trip duration must be 30 days or less."),
  travelStyle: z.enum(travelStyles),
  interests: z.array(z.enum(interests)).min(1, "Choose at least one interest.")
});

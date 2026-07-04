import { budgets, interests, travelStyles, type Interest, type TravelPreferences } from "@/types/travel";

function matchOption<const T extends readonly string[]>(
  value: string | null,
  options: T,
  fallback: T[number]
): T[number] {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  return options.find((option) => option.toLowerCase() === normalized) ?? fallback;
}

function parseInterests(value: string | null) {
  if (!value) {
    return ["Culture"] satisfies Interest[];
  }

  const parsed = value
    .split(",")
    .map((item) => interests.find((interest) => interest.toLowerCase() === item.trim().toLowerCase()))
    .filter((item): item is Interest => Boolean(item));

  return parsed.length > 0 ? parsed : (["Culture"] satisfies Interest[]);
}

export function getPreferencesFromSearchParams(searchParams: URLSearchParams): TravelPreferences {
  return {
    destination: searchParams.get("destination") ?? "",
    budget: matchOption(searchParams.get("budget"), budgets, "Medium"),
    duration: Number(searchParams.get("duration") ?? 3),
    travelStyle: matchOption(searchParams.get("travelStyle"), travelStyles, "Couple"),
    interests: parseInterests(searchParams.get("interests"))
  };
}

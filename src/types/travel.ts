export const budgets = ["Low", "Medium", "High"] as const;
export const travelStyles = ["Solo", "Family", "Friends", "Couple"] as const;
export const interests = [
  "Food",
  "History",
  "Nature",
  "Adventure",
  "Shopping",
  "Photography",
  "Culture"
] as const;

export type Budget = (typeof budgets)[number];
export type TravelStyle = (typeof travelStyles)[number];
export type Interest = (typeof interests)[number];

export interface TravelPreferences {
  destination: string;
  budget: Budget;
  duration: number;
  travelStyle: TravelStyle;
  interests: Interest[];
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  topAttractions: string[];
  hiddenGems: string[];
  localFoods: string[];
  culturalExperiences: string[];
  festivals: string[];
  itinerary: string[];
  tips: string[];
  estimatedBudget: string;
  story: string;
  checklist: {
    documents: ChecklistItem[];
    clothes: ChecklistItem[];
    medicines: ChecklistItem[];
    essentials: ChecklistItem[];
  };
}

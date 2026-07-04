import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
}

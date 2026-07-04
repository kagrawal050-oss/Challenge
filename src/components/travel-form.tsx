"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AlertCircle, WandSparkles } from "lucide-react";
import { travelPreferencesSchema } from "@/lib/validation";
import { budgets, interests, travelStyles, type Interest, type TravelPreferences } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TravelFormProps {
  isLoading: boolean;
  onGenerate: (preferences: TravelPreferences) => void;
}

const initialValues: TravelPreferences = {
  destination: "",
  budget: "Medium",
  duration: 3,
  travelStyle: "Couple",
  interests: ["Food", "Culture"]
};

export function TravelForm({ isLoading, onGenerate }: TravelFormProps) {
  const [values, setValues] = useState<TravelPreferences>(initialValues);
  const [error, setError] = useState<string | null>(null);

  function updateInterest(interest: Interest, checked: boolean) {
    setValues((current) => ({
      ...current,
      interests: checked
        ? [...current.interests, interest]
        : current.interests.filter((item) => item !== interest)
    }));
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: name === "duration" ? Number(value) : value
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = travelPreferencesSchema.safeParse(values);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your trip details and try again.");
      return;
    }

    setError(null);
    onGenerate(parsed.data);
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="destination">
          Destination
        </label>
        <input
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-compass focus:ring-2 focus:ring-teal-100"
          id="destination"
          name="destination"
          maxLength={80}
          onChange={handleTextChange}
          placeholder="Kyoto, Japan"
          required
          value={values.destination}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="budget">
            Budget
          </label>
          <select
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-compass focus:ring-2 focus:ring-teal-100"
            id="budget"
            name="budget"
            onChange={handleTextChange}
            value={values.budget}
          >
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="duration">
            Trip Duration
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-compass focus:ring-2 focus:ring-teal-100"
            id="duration"
            max={30}
            min={1}
            name="duration"
            onChange={handleTextChange}
            type="number"
            value={values.duration}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="travelStyle">
            Travel Style
          </label>
          <select
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-compass focus:ring-2 focus:ring-teal-100"
            id="travelStyle"
            name="travelStyle"
            onChange={handleTextChange}
            value={values.travelStyle}
          >
            {travelStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-ink">Interests</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {interests.map((interest) => {
            const checked = values.interests.includes(interest);

            return (
              <label
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition",
                  checked
                    ? "border-compass bg-teal-50 text-teal-950"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                )}
                key={interest}
              >
                <input
                  checked={checked}
                  className="h-4 w-4 accent-compass"
                  onChange={(event) => updateInterest(interest, event.target.checked)}
                  type="checkbox"
                />
                {interest}
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <div
          className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      <Button className="mt-5 w-full sm:w-auto" disabled={isLoading} type="submit">
        <WandSparkles className="h-4 w-4" aria-hidden="true" />
        Generate AI Travel Plan
      </Button>
    </form>
  );
}

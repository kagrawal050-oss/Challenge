"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/loading-state";
import { PlanResults } from "@/components/plan-results";
import { cn } from "@/lib/utils";
import { budgets, interests, travelStyles, type Interest, type TravelPlan, type TravelPreferences } from "@/types/travel";

type TravelPlanApiResponse =
  | { plan: TravelPlan }
  | { error: string };

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

function getPreferences(searchParams: URLSearchParams): TravelPreferences {
  return {
    destination: searchParams.get("destination") ?? "",
    budget: matchOption(searchParams.get("budget"), budgets, "Medium"),
    duration: Number(searchParams.get("duration") ?? 3),
    travelStyle: matchOption(searchParams.get("travelStyle"), travelStyles, "Couple"),
    interests: parseInterests(searchParams.get("interests"))
  };
}

export function PlanFromQuery() {
  const searchParams = useSearchParams();
  const preferences = useMemo(() => getPreferences(searchParams), [searchParams]);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlan() {
      setError(null);
      setPlan(null);

      try {
        const response = await fetch("/api/travel-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(preferences),
          signal: controller.signal
        });
        const payload = (await response.json()) as TravelPlanApiResponse;

        if (!response.ok || !("plan" in payload)) {
          throw new Error("error" in payload ? payload.error : "Unable to generate this travel plan.");
        }

        setPlan(payload.plan);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to generate this travel plan.");
        }
      }
    }

    void loadPlan();

    return () => controller.abort();
  }, [preferences]);

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-compass">Culture Compass</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Generated Travel Guide</h1>
        </div>
        <Link
          className={cn(
            "inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          )}
          href="/"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
      </div>

      {error ? (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        </section>
      ) : plan ? (
        <PlanResults plan={plan} />
      ) : (
        <LoadingState />
      )}
    </div>
  );
}

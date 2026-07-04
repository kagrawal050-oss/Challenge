"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/loading-state";
import { PlanResults } from "@/components/plan-results";
import { getPreferencesFromSearchParams } from "@/lib/query-preferences";
import { cn } from "@/lib/utils";
import type { TravelPlan } from "@/types/travel";

type TravelPlanApiResponse =
  | { plan: TravelPlan }
  | { error: string };

export function PlanFromQuery() {
  const searchParams = useSearchParams();
  const preferences = useMemo(() => getPreferencesFromSearchParams(searchParams), [searchParams]);
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

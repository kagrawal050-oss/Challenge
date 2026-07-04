"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, Compass, MapPinned, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { PlanResults } from "@/components/plan-results";
import { TravelForm } from "@/components/travel-form";
import { Button } from "@/components/ui/button";
import type { TravelPlan, TravelPreferences } from "@/types/travel";

type TravelPlanApiResponse =
  | { plan: TravelPlan }
  | { error: string };

export function CultureCompassApp() {
  const formRef = useRef<HTMLDivElement>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleGenerate(preferences: TravelPreferences) {
    setIsLoading(true);
    setAppError(null);

    try {
      const response = await fetch("/api/travel-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preferences)
      });
      const payload = (await response.json()) as TravelPlanApiResponse;

      if (!response.ok || !("plan" in payload)) {
        throw new Error("error" in payload ? payload.error : "Unable to generate this travel plan.");
      }

      setPlan(payload.plan);
    } catch (error) {
      setAppError(error instanceof Error ? error.message : "We could not generate a travel plan right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-mist" id="main-content">
      <a className="skip-link" href="#plan-builder">
        Skip to plan builder
      </a>
      <section className="relative overflow-hidden bg-ink text-white">
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1800&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-6xl content-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-teal-50 backdrop-blur">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Culture Compass
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
              Discover Your Next Destination
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
              Build a practical, culture-first travel guide with attractions, hidden gems,
              festivals, local food, a story, and a checklist that remembers your progress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-sunset text-white hover:bg-orange-700" onClick={scrollToForm}>
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-14 max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: MapPinned,
              title: "AI-ready recommendations",
              text: "API-generated plans blend attractions, hidden gems, cultural context, and trip preferences."
            },
            {
              icon: ShieldCheck,
              title: "Secure by default",
              text: "Validated inputs, no secrets in source, and no unsafe HTML rendering."
            },
            {
              icon: Compass,
              title: "Culture-first output",
              text: "Stories, events, foods, and authentic local experiences sit beside practical itinerary details."
            }
          ].map((item) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" key={item.title}>
              <item.icon className="h-6 w-6 text-compass" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="plan-builder"
        className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.3fr] lg:px-8"
        ref={formRef}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-compass">Plan Builder</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Shape the journey</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter a destination and a few preferences. Culture Compass calls the travel-plan API to
            generate a culture-rich guide with attractions, hidden gems, stories, events, and local
            experiences.
          </p>
          <div className="mt-5">
            <TravelForm isLoading={isLoading} onGenerate={handleGenerate} />
          </div>
        </div>

        <div className="space-y-5">
          {appError ? (
            <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
              {appError}
            </section>
          ) : null}
          {isLoading ? <LoadingState /> : plan ? <PlanResults plan={plan} /> : <EmptyState />}
        </div>
      </section>
    </main>
  );
}

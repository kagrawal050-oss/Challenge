import { Compass } from "lucide-react";

export function EmptyState() {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white/75 p-6 text-center shadow-soft">
      <Compass className="mx-auto h-10 w-10 text-compass" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-ink">Your guide is waiting</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Add your destination, travel style, and interests to generate a culture-rich itinerary.
      </p>
    </section>
  );
}

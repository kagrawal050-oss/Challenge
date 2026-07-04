import { Suspense } from "react";
import { PlanFromQuery } from "@/components/plan-from-query";
import { LoadingState } from "@/components/loading-state";

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-mist px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<LoadingState />}>
          <PlanFromQuery />
        </Suspense>
      </div>
    </main>
  );
}

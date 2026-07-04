"use client";

import { useEffect, useMemo, useState } from "react";
import type { TravelPlan } from "@/types/travel";

interface ChecklistProps {
  plan: TravelPlan;
}

type ChecklistState = Record<string, boolean>;

export function Checklist({ plan }: ChecklistProps) {
  const storageKey = useMemo(() => `culture-compass-checklist-${plan.id}`, [plan.id]);
  const [completed, setCompleted] = useState<ChecklistState>({});

  useEffect(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) {
      setCompleted({});
      return;
    }

    try {
      setCompleted(JSON.parse(storedValue) as ChecklistState);
    } catch {
      setCompleted({});
    }
  }, [storageKey]);

  function toggleItem(id: string) {
    setCompleted((current) => {
      const next = { ...current, [id]: !current[id] };
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-ink">Travel Checklist</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {Object.entries(plan.checklist).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold capitalize text-slate-700">{category}</h4>
            <div className="mt-2 space-y-2">
              {items.map((item) => (
                <label
                  htmlFor={`${storageKey}-${item.id}`}
                  className="flex min-h-10 cursor-pointer items-start gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  key={item.id}
                >
                  <input
                    checked={Boolean(completed[item.id])}
                    className="mt-1 h-4 w-4 accent-compass"
                    id={`${storageKey}-${item.id}`}
                    name={`${category}-checklist`}
                    onChange={() => toggleItem(item.id)}
                    type="checkbox"
                  />
                  <span className={completed[item.id] ? "text-slate-400 line-through" : ""}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

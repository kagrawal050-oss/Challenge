"use client";

import { Download, Printer } from "lucide-react";
import jsPDF from "jspdf";
import type { TravelPlan } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Checklist } from "@/components/checklist";

interface PlanResultsProps {
  plan: TravelPlan;
}

function PlanSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sunset" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlanResults({ plan }: PlanResultsProps) {
  function handlePrint() {
    window.print();
  }

  function handleDownloadPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 42;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    const addText = (text: string, size = 11, gap = 18) => {
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, width) as string[];
      lines.forEach((line) => {
        if (y > 760) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += gap;
      });
    };

    const addSection = (title: string, items: string[]) => {
      y += 10;
      addText(title, 15, 22);
      items.forEach((item) => addText(`- ${item}`, 10, 15));
    };

    doc.setFont("helvetica", "bold");
    addText(`Culture Compass: ${plan.destination}`, 20, 26);
    doc.setFont("helvetica", "normal");
    addText(`Estimated budget: ${plan.estimatedBudget}`, 11, 18);
    addSection("Top Attractions", plan.topAttractions);
    addSection("Hidden Gems", plan.hiddenGems);
    addSection("Local Foods to Try", plan.localFoods);
    addSection("Cultural Experiences", plan.culturalExperiences);
    addSection("Festivals or Events", plan.festivals);
    addSection("Itinerary", plan.itinerary);
    addSection("Travel Tips", plan.tips);
    addSection("AI Storytelling", [plan.story]);
    doc.save(`culture-compass-${plan.id}.pdf`);
  }

  return (
    <div className="print-area space-y-5 rounded-lg border border-slate-200 bg-white/60 p-3 shadow-soft sm:p-5">
      <div className="flex flex-col gap-3 rounded-lg bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-100">Generated Travel Guide</p>
          <h2 className="mt-1 text-2xl font-bold">{plan.destination}</h2>
          <p className="mt-2 text-sm text-slate-200">{plan.estimatedBudget}</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button className="bg-white text-ink hover:bg-slate-100" onClick={handlePrint}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </Button>
          <Button className="bg-sunset text-white hover:bg-orange-700" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4" aria-hidden="true" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <PlanSection title="Top Attractions" items={plan.topAttractions} />
        <PlanSection title="Hidden Gems" items={plan.hiddenGems} />
        <PlanSection title="Local Foods to Try" items={plan.localFoods} />
        <PlanSection title="Cultural Experiences" items={plan.culturalExperiences} />
        <PlanSection title="Local Festivals or Events" items={plan.festivals} />
        <PlanSection title="Travel Tips" items={plan.tips} />
      </div>

      <PlanSection title="Suggested Itinerary" items={plan.itinerary} />

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-ink">AI Storytelling</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">{plan.story}</p>
      </section>

      <Checklist plan={plan} />
    </div>
  );
}

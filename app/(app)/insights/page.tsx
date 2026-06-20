import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">AI Insights</h1>
        <p className="text-xs text-text-muted mt-0.5">GPT-4o marketing &amp; sales suggestions from your data</p>
      </div>
      <div className="glass-card p-12 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-harvest-light flex items-center justify-center">
          <Lightbulb className="w-7 h-7 text-harvest" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">AI Insights</p>
          <p className="text-sm text-text-secondary mt-1 max-w-sm">
            Once you have supply, returns, and payment data, GPT-4o will generate actionable
            marketing and sales suggestions tailored to your business. Coming in Phase 5.
          </p>
        </div>
      </div>
    </div>
  );
}

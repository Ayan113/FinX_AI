import { MarketInsightsPanel } from "@/frontend/components/market/market-insights-panel";
import { SectionHeading } from "@/frontend/components/ui/section-heading";

export default function MarketPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Market"
        title="Explore trending sectors and market themes"
        description="Prompt the assistant for market context, then inspect supporting theme data and momentum-oriented visualizations."
      />
      <MarketInsightsPanel />
    </div>
  );
}

import { PortfolioPanel } from "@/frontend/components/portfolio/portfolio-panel";
import { SectionHeading } from "@/frontend/components/ui/section-heading";

export default function PortfolioPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Portfolio"
        title="Stress-test allocation, concentration, and diversification"
        description="Combine rule-based analytics with LLM summaries to surface concentration risk, sector mix, and scenario-oriented takeaways."
      />
      <PortfolioPanel />
    </div>
  );
}

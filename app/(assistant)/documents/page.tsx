import { DocumentAnalysisPanel } from "@/frontend/components/documents/document-analysis-panel";
import { SectionHeading } from "@/frontend/components/ui/section-heading";

export default function DocumentsPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="RAG"
        title="Upload documents and analyze them with citations"
        description="Ingest PDFs or text research, chunk them into a local vector store, and query them through a grounded retrieval-augmented workflow."
      />
      <DocumentAnalysisPanel />
    </div>
  );
}

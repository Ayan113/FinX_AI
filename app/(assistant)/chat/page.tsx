import { ChatPanel } from "@/frontend/components/chat/chat-panel";
import { SectionHeading } from "@/frontend/components/ui/section-heading";

export default function ChatPage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Assistant"
        title="Ask the financial AI copilot"
        description="Chat with a portfolio and market intelligence assistant that can use retrieved document context and optional voice playback."
      />
      <ChatPanel />
    </div>
  );
}

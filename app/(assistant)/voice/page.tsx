import { SectionHeading } from "@/frontend/components/ui/section-heading";
import { VoiceModePanel } from "@/frontend/components/voice/voice-mode-panel";

export default function VoicePage() {
  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Voice"
        title="Speak to the assistant and hear the answer back"
        description="Use browser speech recognition for input, then route responses to ElevenLabs or built-in browser speech for hands-free interaction."
      />
      <VoiceModePanel />
    </div>
  );
}

import { env } from "@/shared/lib/env";

export async function synthesizeSpeech(text: string) {
  if (!env.elevenLabsApiKey) {
    return {
      audioBase64: Buffer.from(text, "utf8").toString("base64"),
      mimeType: "text/plain",
      provider: "fallback"
    };
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${env.elevenLabsVoiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": env.elevenLabsApiKey
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          similarity_boost: 0.65,
          stability: 0.45
        }
      })
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`ElevenLabs request failed: ${response.status} ${message}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return {
    audioBase64: audioBuffer.toString("base64"),
    mimeType: "audio/mpeg",
    provider: "elevenlabs"
  };
}

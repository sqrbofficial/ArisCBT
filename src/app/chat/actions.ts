"use server";

import {
  crisisInterventionAndResourceProvision,
  CrisisInterventionOutput,
} from "@/ai/flows/crisis-intervention-and-resource-provision";
import {
  identifyCognitiveDistortions,
  IdentifyCognitiveDistortionsOutput,
} from "@/ai/flows/cognitive-distortion-identification";
import {
  initialAssessmentAndPersona,
} from "@/ai/flows/initial-assessment-and-persona";
import {
  personalizedSocraticQuestioning,
} from "@/ai/flows/personalized-socratic-questioning";
import { textToSpeech } from "@/ai/flows/text-to-speech";

// A plain message type for server action arguments
type PlainMessage = {
    id: string;
    role: "user" | "ai";
    text: string;
    createdAt: string; // ISO string
};

type HandleMessageResult =
  | { type: "crisis"; data: CrisisInterventionOutput }
  | {
      type: "chat";
      data: {
        aiResponse: string;
        distortion: IdentifyCognitiveDistortionsOutput | null;
      };
    };

export async function handleUserMessage(
  message: string,
  history: PlainMessage[]
): Promise<HandleMessageResult> {
  const crisisCheck = await crisisInterventionAndResourceProvision({
    userInput: message,
  });
  if (crisisCheck.isCrisis) {
    return { type: "crisis", data: crisisCheck };
  }

  const distortionCheck = await identifyCognitiveDistortions({
    userInput: message,
  });

  const isFirstMessage = history.length <= 1;
  let aiResponse: string;

  if (isFirstMessage) {
    const result = await initialAssessmentAndPersona({ userMessage: message });
    aiResponse = result.aiResponse;
  } else {
    const sessionHistory = history
      .map((h) => `${h.role}: ${h.text}`)
      .join("\n");
    const result = await personalizedSocraticQuestioning({
      userInput: message,
      sessionHistory,
    });
    aiResponse = result.aiResponse;
  }

  return {
    type: "chat",
    data: {
      aiResponse: aiResponse,
      distortion: distortionCheck.hasDistortion ? distortionCheck : null,
    },
  };
}

export async function handleTextToSpeech(text: string): Promise<{ audioUrl: string | null }> {
  try {
    const result = await textToSpeech(text);
    return { audioUrl: result.media };
  } catch (error) {
    console.error("Text-to-speech failed:", error);
    return { audioUrl: null };
  }
}

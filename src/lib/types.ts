export type CognitiveDistortion = {
  hasDistortion: boolean;
  identifiedDistortion: string;
  suggestedChallenge: string;
};

export type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  distortion?: CognitiveDistortion | null;
  isTyping?: boolean;
};

export type CrisisInfo = {
  isCrisis: boolean;
  crisisMessage: string;
};

export type MoodEntry = {
  date: string;
  mood: number;
  notes: string;
};

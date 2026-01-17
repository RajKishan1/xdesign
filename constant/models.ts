export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

export const AI_MODELS: ModelOption[] = [
  {
    id: "google/gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "Fast and efficient Gemini model (may have free tier support)",
  },
  {
    id: "google/gemini-3-pro-preview",
    name: "Gemini 3 Pro",
    provider: "Google",
    description: "Advanced Gemini Pro model (requires paid billing)",
  },
];

// Default to Flash since Pro requires billing
export const DEFAULT_MODEL = "google/gemini-3-flash-preview";

export const getModelName = (modelId: string): string => {
  const model = AI_MODELS.find((m) => m.id === modelId);
  return model?.name || modelId;
};

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

export const AI_MODELS: ModelOption[] = [
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    description: "Latest Claude Sonnet model",
  },
  {
    id: "google/gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "Fast and efficient Gemini model",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Advanced Gemini Pro model",
  },
];

export const DEFAULT_MODEL = "google/gemini-3-pro-preview";

export const getModelName = (modelId: string): string => {
  const model = AI_MODELS.find((m) => m.id === modelId);
  return model?.name || modelId;
};

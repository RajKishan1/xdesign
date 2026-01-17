import { google } from "@ai-sdk/google";

// Model mapping: from OpenRouter-style IDs to Vercel AI SDK models
// Returns a model compatible with AI SDK v6 (supports LanguageModelV3)
// The google() function automatically uses GOOGLE_API_KEY from environment variables
export const getModel = (modelId: string) => {
  // Ensure GOOGLE_API_KEY is set
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY environment variable is required");
  }

  // Map OpenRouter-style model IDs to Vercel AI SDK models
  switch (modelId) {
    case "google/gemini-3-pro-preview":
    case "gemini-3-pro":
      // Using gemini-3-pro-preview for Gemini 3 Pro
      return google("gemini-3-pro-preview", {
        apiKey: process.env.GOOGLE_API_KEY,
      });
    case "google/gemini-3-flash-preview":
    case "gemini-3-flash":
      // Using gemini-3-flash-preview for Gemini 3 Flash
      return google("gemini-3-flash-preview", {
        apiKey: process.env.GOOGLE_API_KEY,
      });
    default:
      // Default to Gemini 3 Flash if unknown model (Pro requires billing)
      console.warn(`Unknown model ID: ${modelId}, defaulting to gemini-3-flash-preview`);
      return google("gemini-3-flash-preview", {
        apiKey: process.env.GOOGLE_API_KEY,
      });
  }
};

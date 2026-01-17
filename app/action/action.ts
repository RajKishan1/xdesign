"use server";
import { getModel } from "@/lib/models";
import { generateText } from "ai";

export async function generateProjectName(
  prompt: string,
  model: string = "google/gemini-3-flash-preview"
) {
  try {
    const { text } = await generateText({
      model: getModel(model),
      system: `
        You are an AI assistant that generates very very short project names based on the user's prompt.
        - Keep it under 5 words.
        - Capitalize words appropriately.
        - Do not include special characters.
      `,
      prompt: prompt,
    });
    return text?.trim() || "Untitled Project";
  } catch (error) {
    console.log(error);
    return "Untitled Project";
  }
}

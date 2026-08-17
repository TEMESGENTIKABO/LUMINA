import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

// Extracts the first {...} or [...] JSON block from a text response -
// Gemini sometimes wraps JSON in a sentence or code fence despite instructions.
export function extractJson<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON found in AI response");
  return JSON.parse(match[0]) as T;
}

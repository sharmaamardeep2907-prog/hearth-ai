import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { aiLogger } from "../utils/logger";
import { ApiError } from "../utils/errors";

export class AIService {
  private static genAI: GoogleGenerativeAI | null = null;

  private static init(): boolean {
    if (!config.gemini.apiKey) return false;
    if (!this.genAI) this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    return true;
  }

  private static isEnabled(): boolean { return config.features.aiEnabled && this.init(); }

  static async chat(messages: { role: string; content: string }[], context?: string): Promise<string> {
    if (!this.isEnabled()) return "AI is currently unavailable.";
    try {
      const model = this.genAI!.getGenerativeModel({ model: config.gemini.model, generationConfig: { maxOutputTokens: config.gemini.maxTokens, temperature: config.gemini.temperature } });
      const history = messages.slice(0,-1).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(messages[messages.length-1].content);
      return result.response.text();
    } catch (e: any) { aiLogger.error("AI Chat error", { error: e.message }); throw ApiError.serviceUnavailable("AI Chat"); }
  }

  static async bookingAssistant(query: string): Promise<any> {
    if (!this.isEnabled()) return { intent: "unknown", response: "AI unavailable" };
    try {
      const model = this.genAI!.getGenerativeModel({ model: config.gemini.model });
      const result = await model.generateContent(`Analyze this booking request: "${query}". Return JSON: { "intent": "book_service"|"ask_question"|"get_quote", "category": "electrician"|"plumber"|"ac_repair"|"cleaning"|"other", "response": "friendly reply" }. Only JSON.`);
      return JSON.parse(result.response.text().replace(/```json\s*|\s*```/g, "").trim());
    } catch { return { intent: "unknown", response: "Let me connect you with our booking system." }; }
  }

  static async imageDiagnosis(imageBase64: string, mimeType = "image/jpeg"): Promise<any> {
    if (!this.isEnabled()) throw ApiError.serviceUnavailable("AI Vision");
    try {
      const model = this.genAI!.getGenerativeModel({ model: config.gemini.visionModel });
      const result = await model.generateContent(["Identify this home service issue. Return JSON: { \"problem\":\"desc\", \"category\":\"service\", \"severity\":\"low|medium|high\", \"estimatedCost\":\"₹X-₹Y\" }. Only JSON.", { inlineData: { data: imageBase64, mimeType } }]);
      return JSON.parse(result.response.text().replace(/```json\s*|\s*```/g, "").trim());
    } catch (e: any) { throw ApiError.serviceUnavailable("AI Vision"); }
  }

  static async summarizeReviews(reviews: { rating: number; comment: string }[]): Promise<any> {
    if (!this.isEnabled()) return { summary: "Unavailable", keyStrengths: [], overallRating: 0 };
    try {
      const model = this.genAI!.getGenerativeModel({ model: config.gemini.model });
      const text = reviews.map(r => `Rating: ${r.rating}/5 - "${r.comment}"`).join("\n");
      const result = await model.generateContent(`Summarize these reviews. Return JSON: { "summary":"1-2 sentences", "keyStrengths":["s1","s2"], "overallRating":number }. Only JSON.\nReviews:\n${text}`);
      return JSON.parse(result.response.text().replace(/```json\s*|\s*```/g, "").trim());
    } catch { return { summary: "Unable to generate", keyStrengths: [], overallRating: 0 }; }
  }

  static async smartSearch(query: string): Promise<any> {
    if (!this.isEnabled()) return { categories: [], keywords: query.split(" ") };
    try {
      const model = this.genAI!.getGenerativeModel({ model: config.gemini.model });
      const result = await model.generateContent(`Map this search: "${query}" to categories: electrician,plumber,ac_repair,carpenter,painter,cleaning,salon_spa,tutor. Return JSON: { "categories":["match1"], "keywords":["kw1"] }. Only JSON.`);
      return JSON.parse(result.response.text().replace(/```json\s*|\s*```/g, "").trim());
    } catch { return { categories: [], keywords: query.split(" ") }; }
  }

  static async estimatePrice(category: string, description: string): Promise<any> {
    if (!this.isEnabled()) return { minPrice: 200, maxPrice: 2000, avgPrice: 800 };
    try {
      const model = this.genAI!.getGenerativeModel({ model: config.gemini.model });
      const result = await model.generateContent(`Estimate price in INR for: Category=${category}, Description="${description}". Return JSON: { "minPrice":number, "maxPrice":number, "avgPrice":number, "factors":["f1"] }. Only JSON.`);
      return JSON.parse(result.response.text().replace(/```json\s*|\s*```/g, "").trim());
    } catch { return { minPrice: 200, maxPrice: 2000, avgPrice: 800 }; }
  }
}
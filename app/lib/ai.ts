import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function getBookRecommendations(description: string) {
  try {
    // Use more advanced model for better recommendations
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As a book recommendation expert, suggest 5 books based on this description: "${description}"
    Format the response as a JSON array with objects containing these fields:
    - title: The book title
    - author: The author's name
    - reason: A brief explanation of why this book matches the description
    Only return the JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI recommendation error:", error);
    throw new Error("Failed to get AI book recommendations");
  }
}

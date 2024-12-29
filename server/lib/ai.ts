import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function getBookRecommendations(description: string) {
  try {
    // Use more advanced model for better recommendations
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As a book recommendation expert, analyze this request and suggest 5 books: "${description}"
    For each book, provide:
    1. A relevance score (0-100) based on how well it matches the request
    2. A detailed explanation of why this book matches
    3. Key matching aspects (themes, style, characters)

    Format the response as a JSON array with objects containing:
    - title: string (book title)
    - author: string (author name)
    - relevanceScore: number (0-100)
    - matchingAspects: string[] (list of key matching themes/elements)
    - reason: string (detailed explanation)

    Only return the JSON array, no other text.`;

    console.log("Sending request to Google AI with prompt:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response:", text);
    const recommendations = JSON.parse(text);
    console.log("Parsed AI Recommendations:", recommendations);

    // Sort by relevance score
    return recommendations.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    console.error("AI recommendation error:", error);
    throw new Error("Failed to get AI book recommendations");
  }
}

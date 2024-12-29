import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

interface BookRecommendation {
  title: string;
  author: string;
  relevanceScore: number;
  matchingAspects: string[];
  reason: string;
}

export async function getBookRecommendations(description: string): Promise<BookRecommendation[]> {
  try {
    console.log("Starting AI book recommendation for query:", description);
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

    console.log("Sending request to Google AI...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response received:", text);

    try {
      const recommendations = JSON.parse(text) as BookRecommendation[];

      // Validate and clean the response
      const validRecommendations = recommendations
        .filter(rec => 
          rec.title && 
          rec.author && 
          typeof rec.relevanceScore === 'number' &&
          Array.isArray(rec.matchingAspects) &&
          rec.reason
        )
        .map(rec => ({
          ...rec,
          relevanceScore: Math.min(Math.max(0, rec.relevanceScore), 100), // Ensure score is between 0-100
          matchingAspects: rec.matchingAspects.filter(aspect => typeof aspect === 'string'),
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      console.log("Processed recommendations:", validRecommendations);
      return validRecommendations;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.error("AI recommendation error:", error);
    throw new Error("Failed to get AI book recommendations");
  }
}
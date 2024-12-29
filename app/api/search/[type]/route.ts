import { searchBooksByDescription, searchBooksByQuote } from "@/lib/books";
import { getBookRecommendations } from "@/lib/ai";
import { db } from "@db";
import { searchHistory } from "@db/schema";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const body = await request.json();
    console.log("Search request received:", { body, type: params.type });

    if (!body.query) {
      console.log("Search rejected: Missing query");
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const query = body.query.trim();
    console.log(`Performing ${params.type} search for: "${query}"`);

    let results = [];
    try {
      if (params.type === "description") {
        // Get recommendations from both Google AI and Google Books
        const [aiResults, bookResults] = await Promise.all([
          getBookRecommendations(query),
          searchBooksByDescription(query)
        ]);

        // Merge and deduplicate results
        const aiTitles = new Set(aiResults.map(r => r.title.toLowerCase()));
        const filteredBookResults = bookResults.filter(b => !aiTitles.has(b.title.toLowerCase()));

        results = [
          ...aiResults.map(r => ({
            id: `ai-${Buffer.from(r.title).toString('base64')}`,
            title: r.title,
            author: r.author,
            description: r.reason,
            coverUrl: "/placeholder-cover.jpg", // We'll fetch this from Google Books API
            publishedYear: "",
            genre: "",
            quotes: [],
            createdAt: new Date(),
            aiRecommended: true
          })),
          ...filteredBookResults
        ];
      } else {
        results = await searchBooksByQuote(query);
      }
      console.log(`Search returned ${results.length} results`);
    } catch (searchError) {
      console.error("Search failed:", searchError);
      throw searchError;
    }

    // Log the search in history
    try {
      await db.insert(searchHistory).values({
        query,
        searchType: params.type,
      });
      console.log("Search history logged successfully");
    } catch (dbError) {
      console.error("Failed to log search history:", dbError);
      // Don't throw here, as the search itself succeeded
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search endpoint error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search books" },
      { status: 500 }
    );
  }
}
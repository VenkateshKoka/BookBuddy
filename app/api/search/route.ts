import { searchBooksByDescription, searchBooksByQuote } from "@/lib/books";
import { db } from "@db";
import { searchHistory } from "@db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, type } = await request.json();

    const results = type === "quote"
      ? await searchBooksByQuote(query)
      : await searchBooksByDescription(query);

    // Log the search in history
    await db.insert(searchHistory).values({
      query,
      searchType: type,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const history = await db.query.searchHistory.findMany({
      orderBy: [{ timestamp: "desc" }],
      limit: 10,
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}
import { db } from "@db";
import { books, searchHistory } from "@db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, type } = await request.json();

    let results;
    if (type === "quote") {
      // Search by quote using array containment
      results = await db.query.books.findMany({
        where: sql`EXISTS (
          SELECT 1 FROM unnest(${books.quotes}) quote 
          WHERE quote ILIKE ${`%${query}%`}
        )`,
        limit: 5,
      });
    } else {
      // Search by description using full-text search
      results = await db.query.books.findMany({
        where: sql`
          to_tsvector('english', ${books.description}) @@ plainto_tsquery('english', ${query})
          OR to_tsvector('english', ${books.title}) @@ plainto_tsquery('english', ${query})
        `,
        limit: 10,
      });
    }

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
      orderBy: [desc(searchHistory.timestamp)],
      limit: 10,
    })
    return NextResponse.json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}
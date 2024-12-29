import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchBooksByDescription, searchBooksByQuote } from "./lib/books";
import { getBookRecommendations } from "./lib/ai";
import { db } from "@db";
import { searchHistory } from "@db/schema";
import { desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Unified search endpoint for both quotes and descriptions
  app.post("/api/search", async (req, res) => {
    try {
      console.log("Search request received:", req.body);
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      console.log("Starting parallel search requests");

      // First, try to find exact quote matches
      const quoteResults = await searchBooksByQuote(query);

      // If we find exact quote matches, prioritize those
      if (quoteResults.length > 0) {
        console.log(`Found ${quoteResults.length} quote matches`);

        // Log search in history
        try {
          await db.insert(searchHistory).values({
            query,
            searchType: "quote",
          });
          console.log("Search history logged successfully");
        } catch (dbError) {
          console.error("Failed to log search history:", dbError);
        }

        return res.json(quoteResults);
      }

      // If no quote matches, treat as a description search
      console.log("No quote matches found, searching by description");

      // Get recommendations from both Google AI and Google Books
      const [aiResults, bookResults] = await Promise.all([
        getBookRecommendations(query).catch(err => {
          console.error("AI recommendations failed:", err);
          return []; // Fallback to empty array on error
        }),
        searchBooksByDescription(query)
      ]);

      console.log("AI Results:", aiResults);
      console.log("Book Results:", bookResults);

      // If we have no results from either source, return an empty array
      if (!aiResults.length && !bookResults.length) {
        console.log("No results found from either source");
        return res.json([]);
      }

      // Merge and deduplicate results, prioritizing AI recommendations
      const aiTitles = new Set(aiResults.map(r => r.title.toLowerCase()));
      const filteredBookResults = bookResults.filter(b => !aiTitles.has(b.title.toLowerCase()));

      const results = [
        ...aiResults.map(r => ({
          id: `ai-${Buffer.from(r.title).toString('base64')}`,
          title: r.title,
          author: r.author,
          description: r.reason,
          coverUrl: "/placeholder-cover.jpg",
          publishedYear: "",
          genre: "",
          quotes: [],
          createdAt: new Date(),
          aiRecommended: true,
          relevanceScore: r.relevanceScore,
          matchingAspects: r.matchingAspects
        })),
        ...filteredBookResults.map(b => ({
          ...b,
          aiRecommended: false
        }))
      ];

      // Log search in history
      try {
        await db.insert(searchHistory).values({
          query,
          searchType: "description",
        });
        console.log("Search history logged successfully");
      } catch (dbError) {
        console.error("Failed to log search history:", dbError);
      }

      console.log(`Sending ${results.length} results back to client`);
      res.json(results);
    } catch (error) {
      console.error("Search endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to search books" 
      });
    }
  });

  // Get recent searches
  app.get("/api/search/history", async (req, res) => {
    try {
      const history = await db.query.searchHistory.findMany({
        orderBy: [{ timestamp: desc() }],
        limit: 10,
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
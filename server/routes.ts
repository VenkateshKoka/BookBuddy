import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchBooksByDescription, searchBooksByQuote } from "./lib/books";
import { getBookRecommendations } from "./lib/ai";
import { db } from "@db";
import { searchHistory } from "@db/schema";
import { desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Search books by description
  app.post("/api/search/description", async (req, res) => {
    try {
      console.log("Description search request received:", req.body);
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      // Get recommendations from both Google AI and Google Books
      console.log("Starting parallel AI and Books API requests");
      const [aiResults, bookResults] = await Promise.all([
        getBookRecommendations(query),
        searchBooksByDescription(query)
      ]);

      console.log("AI Results:", aiResults);
      console.log("Book Results:", bookResults);

      // Merge and deduplicate results
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
      await db.insert(searchHistory).values({
        query,
        searchType: "description",
      });

      console.log(`Sending ${results.length} results back to client`);
      res.json(results);
    } catch (error) {
      console.error("Search endpoint error:", error);
      res.status(500).json({ error: "Failed to search books" });
    }
  });

  // Search books by quote
  app.post("/api/search/quote", async (req, res) => {
    try {
      console.log("Quote search request received:", req.body);
      const { quote } = req.body;

      if (!quote) {
        return res.status(400).json({ error: "Quote is required" });
      }

      const results = await searchBooksByQuote(quote);

      // Log search in history
      await db.insert(searchHistory).values({
        query: quote,
        searchType: "quote",
      });

      res.json(results);
    } catch (error) {
      console.error("Quote search failed:", error);
      res.status(500).json({ error: "Failed to search quotes" });
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
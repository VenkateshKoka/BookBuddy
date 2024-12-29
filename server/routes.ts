import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { books, searchHistory } from "@db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Search books by description
  app.post("/api/search/description", async (req, res) => {
    const { query } = req.body;
    
    try {
      const results = await db.query.books.findMany({
        where: or(
          ilike(books.description, `%${query}%`),
          ilike(books.title, `%${query}%`)
        ),
        limit: 10,
      });

      await db.insert(searchHistory).values({
        query,
        searchType: "description",
      });

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search books" });
    }
  });

  // Search books by exact quote
  app.post("/api/search/quote", async (req, res) => {
    const { quote } = req.body;
    
    try {
      const results = await db.query.books.findMany({
        where: ilike(books.quotes[0], `%${quote}%`),
        limit: 5,
      });

      await db.insert(searchHistory).values({
        query: quote,
        searchType: "quote",
      });

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search quotes" });
    }
  });

  // Get recent searches
  app.get("/api/search/history", async (req, res) => {
    try {
      const history = await db.query.searchHistory.findMany({
        orderBy: [desc(searchHistory.timestamp)],
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

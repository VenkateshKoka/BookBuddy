import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  coverUrl: text("cover_url").notNull(),
  isbn: text("isbn").unique(),
  publishedYear: text("published_year"),
  genre: text("genre"),
  quotes: text("quotes").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  searchType: text("search_type").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Create indices using raw SQL for better control
export const createIndices = sql`
  CREATE INDEX IF NOT EXISTS title_idx ON books USING GIN (to_tsvector('english', title));
  CREATE INDEX IF NOT EXISTS description_idx ON books USING GIN (to_tsvector('english', description));
  CREATE INDEX IF NOT EXISTS author_idx ON books USING GIN (to_tsvector('english', author));
`;

export const insertBookSchema = createInsertSchema(books);
export const selectBookSchema = createSelectSchema(books);
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

export const insertSearchHistorySchema = createInsertSchema(searchHistory);
export const selectSearchHistorySchema = createSelectSchema(searchHistory);
export type SearchHistory = typeof searchHistory.$inferSelect;
export type NewSearchHistory = typeof searchHistory.$inferInsert;
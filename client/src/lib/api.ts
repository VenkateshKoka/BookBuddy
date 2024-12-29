import { Book } from "@db/schema";

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Search failed:", errorData);
    throw new Error("Failed to search books");
  }

  const data = await response.json();
  console.log("Search results:", data);
  return data;
}

export async function searchByQuote(quote: string): Promise<Book[]> {
  const response = await fetch("/api/search/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Quote search failed:", errorData);
    throw new Error("Failed to search by quote");
  }

  const data = await response.json();
  console.log("Quote search results:", data);
  return data;
}
import { Book } from "@db/schema";

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch("/api/search/description", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to search books");
  }

  return response.json();
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
    throw new Error("Failed to search by quote");
  }

  return response.json();
}

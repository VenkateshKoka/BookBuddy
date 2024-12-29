import { Book } from "@db/schema";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export async function searchBooksByDescription(query: string): Promise<Book[]> {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=10`
    );

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items?.map(transformGoogleBook) ?? [];
  } catch (error) {
    console.error("Failed to fetch books from Google Books API:", error);
    throw new Error("Failed to search books");
  }
}

export async function searchBooksByQuote(quote: string): Promise<Book[]> {
  try {
    // Google Books API doesn't support direct quote search, so we'll search in snippets
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q="${encodeURIComponent(quote)}"&maxResults=5`
    );

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items?.map(transformGoogleBook) ?? [];
  } catch (error) {
    console.error("Failed to fetch books by quote from Google Books API:", error);
    throw new Error("Failed to search books by quote");
  }
}

function transformGoogleBook(googleBook: any): Book {
  const volumeInfo = googleBook.volumeInfo;

  return {
    id: googleBook.id,
    title: volumeInfo.title || "Unknown Title",
    author: volumeInfo.authors?.[0] ?? "Unknown Author",
    description: volumeInfo.description ?? "No description available",
    coverUrl: volumeInfo.imageLinks?.thumbnail ?? "/placeholder-cover.jpg",
    isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
    publishedYear: volumeInfo.publishedDate?.split("-")[0],
    genre: volumeInfo.categories?.[0],
    quotes: [], // Google Books API doesn't provide quotes
    createdAt: new Date(),
  };
}
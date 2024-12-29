import { Book } from "@db/schema";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export async function searchBooksByDescription(query: string): Promise<Book[]> {
  try {
    // Format query to improve search results
    const formattedQuery = encodeURIComponent(`${query} subject:fiction`);
    const url = `${GOOGLE_BOOKS_API}?q=${formattedQuery}&maxResults=10&langRestrict=en&printType=books`;

    console.log("Fetching books from:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error("Google Books API error:", error);
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Google Books API returned ${data.totalItems} total items`);

    if (!data.items) {
      console.log("No books found for query:", query);
      return [];
    }

    return data.items.map(transformGoogleBook);
  } catch (error) {
    console.error("Failed to fetch books from Google Books API:", error);
    throw new Error("Failed to search books");
  }
}

export async function searchBooksByQuote(quote: string): Promise<Book[]> {
  try {
    // Format quote search to be more precise
    const formattedQuery = encodeURIComponent(`"${quote}"`);
    const url = `${GOOGLE_BOOKS_API}?q=${formattedQuery}&maxResults=5&langRestrict=en&printType=books`;

    console.log("Fetching books by quote from:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error("Google Books API error:", error);
      throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Google Books API returned ${data.totalItems} total items for quote search`);

    if (!data.items) {
      console.log("No books found for quote:", quote);
      return [];
    }

    return data.items.map(transformGoogleBook);
  } catch (error) {
    console.error("Failed to fetch books by quote from Google Books API:", error);
    throw new Error("Failed to search books by quote");
  }
}

function transformGoogleBook(googleBook: any): Book {
  const volumeInfo = googleBook.volumeInfo;

  // Add more detailed logging for book transformation
  console.log("Processing book:", volumeInfo.title);

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
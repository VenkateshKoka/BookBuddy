import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchBooks } from "@/lib/api";
import { Book } from "@db/schema";

interface SearchBarProps {
  onSearch: (results: Book[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function SearchBar({ onSearch, setIsLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const results = await searchBooks(query);
      onSearch(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto relative">
      <div className="relative flex w-full">
        <Input
          type="text"
          placeholder="Enter a book description or quote..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 shadow-sm border-primary/20 focus:border-primary"
          onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleSearch()}
          disabled={isSubmitting}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

      <Button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-80"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search Books</span>
          </div>
        )}
      </Button>
    </div>
  );
}
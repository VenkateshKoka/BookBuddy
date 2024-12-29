"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Book } from "@db/schema";

interface SearchBoxProps {
  onSearch: (results: Book[]) => void;
  onSearchStart: () => void;
}

export default function SearchBox({ onSearch, onSearchStart }: SearchBoxProps) {
  const [searchType, setSearchType] = useState<"description" | "quote">("description");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    onSearchStart();

    try {
      console.log(`Starting ${searchType} search for: "${trimmedQuery}"`);

      const response = await fetch(`/api/search/${searchType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      console.log(`Search returned ${data.length} results`);
      onSearch(data);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search books. Please try again.",
        variant: "destructive",
      });
      onSearch([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="flex gap-4">
        <Select
          value={searchType}
          onValueChange={(value: "description" | "quote") => setSearchType(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Search type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="description">Description</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={
              searchType === "description"
                ? "Describe the book you're looking for..."
                : "Enter a quote from the book..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSearch()}
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Searching...
          </div>
        ) : (
          "Search Books"
        )}
      </Button>
    </div>
  );
}
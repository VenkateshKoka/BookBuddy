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

interface SearchBoxProps {
  onSearch: (results: any[]) => void;
  onSearchStart: () => void;
}

export default function SearchBox({ onSearch, onSearchStart }: SearchBoxProps) {
  const [searchType, setSearchType] = useState("description");
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    onSearchStart();
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          type: searchType,
        }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();
      onSearch(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search books. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="flex gap-4">
        <Select
          value={searchType}
          onValueChange={setSearchType}
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
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Search Books
      </Button>
    </div>
  );
}

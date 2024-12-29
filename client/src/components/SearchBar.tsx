import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchBooks, searchByQuote } from "@/lib/api";
import { Book } from "@db/schema";

interface SearchBarProps {
  onSearch: (results: Book[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function SearchBar({ onSearch, setIsLoading }: SearchBarProps) {
  const [searchType, setSearchType] = useState("description");
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await (searchType === "description" 
        ? searchBooks(query)
        : searchByQuote(query));
      onSearch(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
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
            placeholder={searchType === "description" 
              ? "Describe the book you're looking for..."
              : "Enter a quote from the book..."}
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

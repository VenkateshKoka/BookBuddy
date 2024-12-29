import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { Book } from "@db/schema";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1633362057669-0c9f66d1f6cd"
            alt="Library"
            className="w-full h-[500px] object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        
        <div className="relative z-10 pt-20 pb-32 container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Find Your Next Great Read
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Search by description, quotes, or characteristics to discover books you'll love
          </p>
          
          <SearchBar 
            onSearch={(results) => setSearchResults(results)}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <SearchResults results={searchResults} isLoading={isLoading} />
      </div>

      {/* Feature Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Description Search</h3>
              <p className="text-muted-foreground">
                Describe the type of book you're looking for and let our engine find the perfect match
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Quote Search</h3>
              <p className="text-muted-foreground">
                Remember a specific quote? Find the book it came from instantly
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized book suggestions based on your interests and preferences
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

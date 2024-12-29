import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import BookCarousel from "@/components/BookCarousel";
import { Book } from "@db/schema";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Quote, Sparkles } from "lucide-react";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Separate books into different categories
  const { aiRecommendations, regularBooks } = useMemo(() => {
    return {
      aiRecommendations: searchResults.filter(book => book.aiRecommended),
      regularBooks: searchResults.filter(book => !book.aiRecommended),
    };
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-background pointer-events-none" />
        <div className="relative z-10 pt-32 pb-24 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Find Your Next Great Read
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Search by description, quotes, or discover new books through smart recommendations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SearchBar 
              onSearch={(results) => setSearchResults(results)}
              setIsLoading={setIsLoading}
            />
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchResults results={[]} isLoading={true} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {aiRecommendations.length > 0 && (
                <BookCarousel 
                  books={aiRecommendations} 
                  title="AI-Powered Recommendations" 
                />
              )}
              {regularBooks.length > 0 && (
                <BookCarousel 
                  books={regularBooks} 
                  title="Book Matches" 
                />
              )}
              {searchResults.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-muted-foreground">
                    Start searching to discover books
                  </h2>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6 text-primary" />}
              title="Smart Description Search"
              description="Describe the type of book you're looking for and let our AI find the perfect match"
            />
            <FeatureCard 
              icon={<Quote className="w-6 h-6 text-primary" />}
              title="Quote Search"
              description="Remember a specific quote? We'll find the book it came from instantly"
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-primary" />}
              title="AI Recommendations"
              description="Get personalized book suggestions powered by advanced AI technology"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-primary/10">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-3 rounded-full bg-primary/10">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
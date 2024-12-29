"use client";

import { useState } from "react";
import SearchBox from "./components/SearchBox";
import { Book } from "@db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'

export default function Home() {
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-[500px] bg-gradient-to-b from-primary/5 to-background" />
        </div>

        <div className="relative z-10 pt-20 pb-32 container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Find Your Next Great Read
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Search by description, quotes, or discover new books through smart recommendations
          </p>

          <SearchBox
            onSearchStart={() => setIsLoading(true)}
            onSearch={(newResults) => {
              setResults(newResults);
              setIsLoading(false);
            }}
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-48 w-full object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Start searching to discover books
            </h2>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Description Search"
              description="Describe the type of book you're looking for and let our engine find the perfect match"
            />
            <FeatureCard 
              title="Quote Search"
              description="Remember a specific quote? Find the book it came from instantly"
            />
            <FeatureCard 
              title="Smart Recommendations"
              description="Get personalized book suggestions based on your interests and preferences"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
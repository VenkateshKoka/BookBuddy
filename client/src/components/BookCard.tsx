import { Book } from "@db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star } from "lucide-react";
import { Sparkles as SparkleEffect } from "@/components/ui/sparkle";

interface BookCardProps {
  book: Book & { 
    aiRecommended?: boolean;
    relevanceScore?: number;
    matchingAspects?: string[];
  };
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow relative overflow-hidden">
      {book.aiRecommended && (
        <SparkleEffect className="z-10" />
      )}
      <CardHeader className="relative h-48">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
        {book.aiRecommended && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            <Badge variant="secondary" className="gap-1 bg-background/80 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              AI Recommended
            </Badge>
            {book.relevanceScore && (
              <Badge variant="default" className="gap-1 bg-primary/80 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-current" />
                {book.relevanceScore}% Match
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">by {book.author}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {book.genre && (
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
          )}
          {book.publishedYear && (
            <Badge variant="outline" className="text-xs">
              {book.publishedYear}
            </Badge>
          )}
          {book.matchingAspects?.map((aspect, i) => (
            <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary">
              {aspect}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description}
        </p>
      </CardContent>
    </Card>
  );
}
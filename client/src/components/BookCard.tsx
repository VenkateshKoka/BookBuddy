import { Book } from "@db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="relative h-48">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">by {book.author}</p>
        
        <div className="flex gap-2 mb-3">
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
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description}
        </p>
      </CardContent>
    </Card>
  );
}

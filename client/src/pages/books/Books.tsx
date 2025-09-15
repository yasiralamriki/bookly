import "../../app.css"
import { useEffect, useState, useCallback } from "react";
import { BookOpen, Library } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewBookButton } from "@/components/books/newbookbutton";
import { BookSearchBar } from "@/components/books/booksearchbar";
import { BooksFilter } from "@/components/books/booksfilter";
import { BookCard } from "@/components/books/bookcard";
import { useTranslation } from "react-i18next";
import * as Locale from "@/lib/locale";

type Book = {
  id: number;
  date: number;
  title: string;
  author: string;
  completed: boolean;
};

function NoBooksAlert() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex justify-center items-center p-8">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
          <BookOpen className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{t("no_books_found")}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{t("no_books_match_criteria")}</p>
        </div>
      </div>
    </div>
  );
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Record<string, { name: string; deathDate?: number }>>({});
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation();

  const fetchBooks = () => {
    fetch('/api/books')
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  const fetchBookAuthor = useCallback(async (authorName: string): Promise<number | undefined> => {
    // Return cached value if already fetched
    if (authors[authorName]) {
      return authors[authorName].deathDate;
    }

    try {
      const response = await fetch(`/api/authors/?name=${authorName}`);
      const data = await response.json();
      
      // Cache the author data
      setAuthors(prev => ({
        ...prev,
        [authorName]: {
          name: data.name,
          deathDate: data.deathDate
        }
      }));
      
      return data.deathDate;
    } catch (error) {
      console.error('Error fetching author:', error);
      return undefined;
    }
  }, [authors]);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Preload author data when books change
  useEffect(() => {
    const loadAuthorsData = async () => {
      const uniqueAuthorNames = [...new Set(books.map(book => book.author))];
      
      for (const authorName of uniqueAuthorNames) {
        if (!authors[authorName]) {
          await fetchBookAuthor(authorName);
        }
      }
    };

    if (books.length > 0) {
      loadAuthorsData();
    }
  }, [books, authors, fetchBookAuthor]);

  useEffect(() => {
    // Filter and sort books when search query or sort order changes
    const filtered = books.filter(book => {
      // If search query is empty, show all books
      if (!searchQuery.trim()) return true;
      
      // Helper function to check if text contains search query using localeCompare base sensitivity
      const containsQuery = (text: string, query: string): boolean => {
        // Check if any part of the text matches the query using localeCompare
        for (let i = 0; i <= text.length - query.length; i++) {
          const substring = text.substring(i, i + query.length);
          if (substring.localeCompare(query, undefined, { sensitivity: 'base' }) === 0) {
            return true;
          }
        }
        return false;
      };
      
      return containsQuery(book.title, searchQuery) || containsQuery(book.author, searchQuery);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "ascending") {
        return a.title.localeCompare(b.title, undefined, { usage: "sort", sensitivity: 'base' });
      } else {
        return b.title.localeCompare(a.title, undefined, { usage: "sort", sensitivity: 'base' });
      }
    });

    setFilteredBooks(sorted);
  }, [books, searchQuery, sortOrder]);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      const response = await fetch(`/api/books/?id=${bookId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove the book from the local state
        const updatedBooks = books.filter(book => book.id !== bookId);
        setBooks(updatedBooks);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] px-4 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 lg:py-32 flex flex-col justify-start gap-6 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-6 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <Library className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("books")}</h1>
              <p className="text-sm text-muted-foreground">
                {filteredBooks.length} {filteredBooks.length === 1 ? t("book") : t("books")}
                {searchQuery && ` • ${t("filtered_results")}`}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700">
            <BookOpen className="w-3 h-3 mr-1" />
            {Locale.formatNumberByLocale(filteredBooks.length, i18n.language)}
          </Badge>
        </div>
        
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <BookSearchBar 
              searchQuery={searchQuery} 
              handleSearchChange={handleSearchChange} 
            />
            <BooksFilter 
              sortOrder={sortOrder} 
              handleSortChange={handleSortChange} 
            />
          </div>
          <NewBookButton onBookAdded={fetchBooks} />
        </div>
      </div>

      {/* Books Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 min-h-0">
          {filteredBooks.length === 0 ? (
            <NoBooksAlert />
          ) : (
            <CardContent className="flex-1 p-6 min-h-0">
              <div className="h-full w-full overflow-y-auto hide-scrollbar">
                <div className="space-y-4">
                  {filteredBooks.map((book) => (
                    <BookCard 
                      key={book.id}
                      id={book.id} 
                      date={book.date}
                      title={book.title} 
                      completed={book.completed}
                      authorName={book.author} 
                      authorDeathDate={authors[book.author]?.deathDate}
                      onDelete={handleDeleteBook} 
                      onBookAdded={fetchBooks}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
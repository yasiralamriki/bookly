import "../../app.css"
import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NewBookButton } from "@/components/books/newbookbutton";
import { BookSearchBar } from "@/components/books/booksearchbar";
import { BooksFilter } from "@/components/books/booksfilter";
import { BookCard } from "@/components/books/bookcard";
import { useTranslation } from "react-i18next";

type Book = {
  id: number;
  date: number;
  title: string;
  author: string;
};

function NoBooksAlert() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex-1 flex justify-center items-center">
      <Alert variant="destructive" className={`text-left max-w-md ${i18n.dir(i18n.language) === "rtl" ? "text-right" : "text-left"}`}>
        <CircleAlert className="mx-auto" />
        <AlertTitle>{t("no_books_found")}</AlertTitle>
        <AlertDescription>{t("no_books_match_criteria")}</AlertDescription>
      </Alert>
    </div>
  );
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = () => {
    fetch('/api/books')
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
    <div id="main" className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start items-center gap-8 overflow-hidden">
      <div id="main-container" className="self-stretch flex-1 inline-flex flex-col justify-start items-start gap-4 min-h-0">
        <div id="control-container" className="self-stretch inline-flex justify-between items-center">
          <div id="search-container" className="inline-flex justify-start items-center gap-4">
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
        <Card id="books-container" className="self-stretch flex-1 p-8 flex flex-col min-h-0 overflow-hidden">
          {filteredBooks.length === 0 ? (
            <NoBooksAlert />
          ) : (
            <ScrollArea className="flex-1 w-full h-0">
              <div className="flex flex-col justify-start items-stretch gap-4 pr-4">
                {filteredBooks.map((book) => (
                  <BookCard 
                    key={book.id}
                    id={book.id} 
                    date={book.date}
                    title={book.title} 
                    author={book.author} 
                    onDelete={handleDeleteBook} 
                    onBookAdded={fetchBooks}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  )
}
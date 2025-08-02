import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ , ArrowUpZA , CircleAlert, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NewBookButton } from "@/components/books/newbookbutton";

type Book = {
    id: number;
    title: string;
    author: string;
    // add other fields if needed
};

export function BooksContainer() {
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
        const filtered = books.filter(book => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const sorted = [...filtered].sort((a, b) => {
            if (sortOrder === "ascending") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
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
                        <Command className="w-64 h-10  border rounded-md [&>[data-slot=command-input-wrapper]]:border-none">
                            <CommandInput 
                                placeholder="Search for books..." 
                                value={searchQuery}
                                onValueChange={handleSearchChange}
                            />
                            <CommandList></CommandList>
                        </Command>
                        <Select defaultValue="ascending" value={sortOrder} onValueChange={handleSortChange}>
                            <SelectTrigger className="!h-10 cursor-pointer">
                                <SelectValue placeholder="Sort By"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ascending" className="cursor-pointer">
                                    <ArrowDownAZ />
                                    Ascending
                                </SelectItem>
                                <SelectItem value="descending" className="cursor-pointer">
                                    <ArrowUpZA />
                                    Descending
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <NewBookButton onBookAdded={fetchBooks} />
                </div>
                <Card id="books-container" className="self-stretch flex-1 p-8 flex flex-col min-h-0 overflow-hidden">
                    {filteredBooks.length === 0 ? (
                        <div className="flex-1 flex justify-center items-center">
                            <Alert variant="destructive" className="text-left max-w-md">
                                <CircleAlert className="mx-auto" />
                                <AlertTitle>No books found</AlertTitle>
                                <AlertDescription>
                                    No books match your search criteria. Please try a different search term or add new books.
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 w-full h-0">
                            <div className="flex flex-col justify-start items-stretch gap-4 pr-4">
                                {filteredBooks.map((book) => (
                                    <Card key={book.id} className="p-4 border hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <div className="mr-4">
                                                <h3 className="font-semibold text-lg text-left">{book.title}</h3>
                                                <p className="text-muted-foreground text-left">{book.author}</p>
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            size="icon" 
                                            className="cursor-pointer size-8 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out" 
                                            onClick={() => handleDeleteBook(book.id)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </Card>
            </div>
        </div>
    )
}
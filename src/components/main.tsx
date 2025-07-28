import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDownAZ , ArrowUpZA , Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import booksData from "@/data/books.json";
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

export function Main() {
    const [books, setBooks] = useState(booksData);
    const [sortOrder, setSortOrder] = useState("descending");

    function deleteBook(index: number) {
        setBooks(books.filter((_, i) => i !== index));
    }

    function handleSortChange(value: string) {
        setSortOrder(value);
        const sortedBooks = [...books].sort((a, b) => {
            if (value === "ascending") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
        setBooks(sortedBooks);
    }

    return (
        <div id="main" className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start items-center gap-8 overflow-hidden">
            <div id="main-container" className="self-stretch flex-1 inline-flex flex-col justify-start items-start gap-4 min-h-0">
                <div id="control-container" className="self-stretch inline-flex justify-between items-center">
                    <div id="search-container" className="inline-flex justify-start items-center gap-4">
                        <Command className="w-64 h-10  border rounded-md [&>[data-slot=command-input-wrapper]]:border-none">
                            <CommandInput placeholder="Search for books..." />
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
                    <Button size="lg" className="cursor-pointer">
                        <Plus /> New Book
                    </Button>
                </div>
                <Card id="books-container" className="self-stretch flex-1 p-8 flex flex-col min-h-0 overflow-hidden">
                    <ScrollArea className="flex-1 w-full h-0">
                        <div className="flex flex-col justify-start items-stretch gap-4 pr-4">
                            {/* Sample book items to test scrolling */}
                            {books.map((book, index) => (
                                <Card key={index} className="p-4 border hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="mr-4">
                                            <h3 className="font-semibold text-lg text-left">{book.title}</h3>
                                            <p className="text-muted-foreground text-left">{book.author}</p>
                                        </div>
                                        <Button variant="secondary" size="icon" className="cursor-pointer size-8 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out" onClick={() => deleteBook(index)}>
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    )
}
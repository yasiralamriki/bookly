import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { Plus, ArrowDownNarrowWide, ArrowDownWideNarrow, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialBooks = [
  { title: "Kitāb at-Tawhīd", author: "Shaykh Muhammad ibn 'Abd al-Wahhāb" },
  { title: "Al-'Aqīdah al-Wāsitiyyah", author: "Shaykh al-Islām Ibn Taymiyyah" },
  { title: "Usūl ath-Thalāthah", author: "Shaykh Muhammad ibn 'Abd al-Wahhāb" },
  { title: "Al-Qawā'id al-Arba'", author: "Shaykh Muhammad ibn 'Abd al-Wahhāb" },
  { title: "Sharh as-Sunnah", author: "Imam Al-Barbahārī" },
  { title: "Al-Ibānah", author: "Shaykh Abū al-Hasan al-Ash'arī" },
  { title: "'Aqīdah at-Tahāwiyyah", author: "Shaykh Abū Ja'far at-Tahāwī" },
  { title: "Kashf ash-Shubuhāt", author: "Shaykh Muhammad ibn 'Abd al-Wahhāb" },
  { title: "Al-'Aqīdah al-Hamawiyyah", author: "Shaykh al-Islām Ibn Taymiyyah" },
  { title: "Fadl al-Islām", author: "Shaykh Muhammad ibn 'Abd al-Wahhāb" },
  { title: "Al-Usūl as-Sittah", author: "Shaykh Muhammad ibn 'Abd al-Wahhāb" },
  { title: "Majmū' al-Fatāwā", author: "Shaykh al-Islām Ibn Taymiyyah" },
  { title: "Ad-Durar as-Saniyyah", author: "Various Scholars" },
  { title: "Fath al-Majīd", author: "Shaykh 'Abd ar-Rahmān ibn Hasan" },
  { title: "Taysīr al-'Azīz al-Hamīd", author: "Shaykh Sulaymān ibn 'Abdullāh" }
];

export function Main() {
    const [books, setBooks] = useState(initialBooks);

    const handleDelete = (index: number) => {
        setBooks(prevBooks => prevBooks.filter((_, i) => i !== index));
    };

    return (
        <div id="main" className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start items-center gap-8 overflow-hidden">
            <div id="main-container" className="self-stretch flex-1 inline-flex flex-col justify-start items-start gap-4 min-h-0">
                <div id="control-container" className="self-stretch inline-flex justify-between items-center">
                    <div id="search-container" className="inline-flex justify-start items-center gap-4">
                        <Command className="w-64 h-10  border rounded-md [&>[data-slot=command-input-wrapper]]:border-none">
                            <CommandInput placeholder="Search for books..." />
                            <CommandList></CommandList>
                        </Command>
                        <Select>
                            <SelectTrigger className="!h-10">
                                <SelectValue placeholder="Sort By"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="descending">
                                    <ArrowDownWideNarrow />
                                    Descending
                                </SelectItem>
                                <SelectItem value="ascending">
                                    <ArrowDownNarrowWide />
                                    Ascending
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
                                        <Button variant="secondary" size="icon" className="cursor-pointer size-8 hover:bg-red-500 hover:text-white" onClick={() => handleDelete(index)}>
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
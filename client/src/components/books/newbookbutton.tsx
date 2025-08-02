import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react";
import { useState } from "react";

interface NewBookProps {
  onBookAdded?: () => void;
}

export function NewBookButton({ onBookAdded }: NewBookProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddBook = async () => {
    if (!title.trim() || !author.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim()
        })
      });

      if (response.ok) {
        // Clear form
        setTitle("");
        setAuthor("");
        setIsOpen(false);
        
        // Refresh the books list
        if (onBookAdded) {
          onBookAdded();
        }
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="cursor-pointer gradient-button">
            <Plus /> New Book
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a new book</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="book-name">Book Name</Label>
            <Input 
              type="text" 
              id="book-name" 
              placeholder="Kitāb at-Tawhīd"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="author-name">Author Name</Label>
            <Input 
              type="text" 
              id="author-name" 
              placeholder="Shaykh Muhammad ibn 'Abd al-Wahhāb"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="cursor-pointer gradient-button" 
            onClick={handleAddBook}
            disabled={!title.trim() || !author.trim()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
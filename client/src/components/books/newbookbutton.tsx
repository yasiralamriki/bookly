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
import { useTranslation } from "react-i18next";

interface NewBookProps {
  onBookAdded?: () => void;
}

export function NewBookButton({ onBookAdded }: NewBookProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();

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
          author: author.trim(),
          notes: []
        })
      });

      try {
        const data = await fetch('api/authors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const authors = await data.json();
        // Assuming authors is an array of author names or objects with a 'name' property
        type AuthorType = { name: string } | string;
        const authorExists = Array.isArray(authors)
          ? authors.some((a: AuthorType) =>
              typeof a === "string"
                ? a === author.trim()
                : a.name === author.trim()
            )
          : author.trim() in authors;

        if (!authorExists) {
          // If author doesn't exist, create a new author
          await fetch("/api/authors", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: author.trim()
            })
          });
        }
      } catch (error) {
        console.error('Error checking/adding author:', error);
      }

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
            <Plus /> {t("new_book")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t("create_book")}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-4">
            <Label htmlFor="book-name">{t("book_name")}</Label>
            <Input 
              type="text" 
              id="book-name" 
              placeholder={`${i18n.language === 'ar' ? 'كتاب التوحيد' : "Kitāb at-Tawhīd"}`}
              onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className="grid w-full items-center gap-4">
            <Label htmlFor="author-name">{t("author_name")}</Label>
            <Input 
              type="text" 
              id="author-name" 
              placeholder={`${i18n.language === 'ar' ? 'الشيخ محمد بن عبد الوهاب' : "Shaykh Muhammad ibn 'Abd al-Wahhāb"}`}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            className="cursor-pointer gradient-button" 
            onClick={handleAddBook}
            disabled={!title.trim() || !author.trim()}
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
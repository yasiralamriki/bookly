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
            <Plus /> {t("New Book")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t("Create a new book")}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="book-name">{t("Book Name")}</Label>
            <Input 
              type="text" 
              id="book-name" 
              placeholder={`${i18n.language === 'ar' ? 'كتاب التوحيد' : "Kitāb at-Tawhīd"}`}
              onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="author-name">{t("Author Name")}</Label>
            <Input 
              type="text" 
              id="author-name" 
              placeholder={`${i18n.language === 'ar' ? 'الشيخ محمد بن عبد الوهاب' : "Shaykh Muhammad ibn 'Abd al-Wahhāb"}`}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            className="cursor-pointer gradient-button" 
            onClick={handleAddBook}
            disabled={!title.trim() || !author.trim()}
          >
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
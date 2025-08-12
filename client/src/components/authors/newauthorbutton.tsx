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

interface NewAuthorProps {
  onAuthorAdded?: () => void;
}

export function NewAuthorButton({ onAuthorAdded }: NewAuthorProps) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const handleAddAuthor = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim()
        })
      });

      if (response.ok) {
        // Clear form
        setName("");
        setIsOpen(false);

        // Refresh the authors list
        if (onAuthorAdded) {
          onAuthorAdded();
        }
      }
    } catch (error) {
      console.error('Error adding author:', error);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="cursor-pointer gradient-button">
            <Plus /> {t("new_author")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t("create_author")}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="author-name">{t("author_name")}</Label>
            <Input 
              type="text" 
              id="author-name" 
              placeholder={`${i18n.language === 'ar' ? 'الشيخ محمد بن عبد الوهاب' : "Shaykh Muhammad ibn 'Abd al-Wahhāb"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            className="cursor-pointer gradient-button" 
            onClick={handleAddAuthor}
            disabled={!name.trim()}
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
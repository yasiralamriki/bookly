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

// Utility functions for number conversion
const toArabicNumerals = (str: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
};

const toEnglishNumerals = (str: string): string => {
  return str.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
};

interface NewAuthorProps {
  onAuthorAdded?: () => void;
}

export function NewAuthorButton({ onAuthorAdded }: NewAuthorProps) {
  const [name, setName] = useState("");
  const [deathDate, setDeathDate] = useState<number | "">("");
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
          name: name.trim(),
          deathDate: deathDate === "" ? null : deathDate,
        })
      });

      if (response.ok) {
        // Clear form
        setName("");
        setDeathDate("");
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
        <div className="grid w-full items-center gap-4">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="authorName" className="gap-1">
              {t("author_name")}
              <>
                <span className="text-destructive">*</span>
              </>
            </Label>
            <Input 
              type="text" 
              id="authorName" 
              placeholder={`${i18n.language === 'ar' ? 'الشيخ محمد بن عبد الوهاب' : "Shaykh Muhammad ibn 'Abd al-Wahhāb"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="authorDeathDate">{t("author_death_date")}</Label>
            <div className={i18n.language === 'ar' ? 'hijri-input' : ''}>
              <Input 
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="authorDeathDate" 
                placeholder={t("author_death_date_placeholder")}
                value={deathDate === "" ? "" : (i18n.language === 'ar' ? toArabicNumerals(String(deathDate)) : String(deathDate))}
                onChange={(e) => {
                  const value = e.target.value;
                  // Convert Arabic numerals to English for processing
                  const englishValue = i18n.language === 'ar' ? toEnglishNumerals(value) : value;
                  
                  // Only allow numeric input
                  if (englishValue === "" || /^\d+$/.test(englishValue)) {
                    setDeathDate(englishValue === "" ? "" : Number(englishValue));
                  }
                }}
                style={{
                  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  textAlign: i18n.language === 'ar' ? 'right' : 'left'
                }}
              />
            </div>
          </div>
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
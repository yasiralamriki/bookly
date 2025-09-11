import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import { BookCopy, Trash2, UserRound, CalendarClock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Locale from "@/lib/locale";

function BookCardTitle({ title }: { title: string }) {
  return (
    <h3 className="font-semibold text-lg">{title}</h3>
  )
}

function BookCardAuthor({ authorName, authorDeathDate }: { authorName: string, authorDeathDate?: number }) {
  const {i18n} = useTranslation();

  return (
    <div className="flex items-center text-center gap-2">
      <UserRound size={16} className="text-emerald-500 flex-shrink-0" />
      <p className="text-sm font-normal text-muted-foreground">
        {authorName} {authorDeathDate && `(${Locale.formatDeathDate(authorDeathDate, i18n.language)})`}
      </p>
    </div>
  )
}

function BookCardDate({ timestamp, locale }: { timestamp: number, locale: string }) {
  const { t } = useTranslation();
  const formattedDate = Locale.formatDateByLocale(timestamp, locale, t);
  
  return (
    <div className="flex items-center text-center gap-2">
      <CalendarClock size={16} className="text-emerald-500 flex-shrink-0" />
      <p className="text-sm font-normal text-muted-foreground">{formattedDate}</p>
    </div>
  )
}

interface BookCardDuplicateButtonProps {
  title: string;
  authorName: string;
  onBookAdded?: () => void;
}

function BookCardDuplicateButton({ title, authorName, onBookAdded }: BookCardDuplicateButtonProps) {
  const [newTitle, setTitle] = useState(title);
  const [newAuthor, setAuthor] = useState(authorName);

  const handleDuplicateBook = async () => {
    if (!newTitle.trim() || !newAuthor.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          author: newAuthor.trim()
        })
      });

      if (response.ok) {
        // Clear form
        setTitle("");
        setAuthor("");

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
    <Button
      variant="secondary"
      size="icon"
      className={`cursor-pointer size-8 hover:bg-emerald-500 hover:text-white transition duration-300 ease-in-out`}
      onClick={handleDuplicateBook}
    >
      <BookCopy />
    </Button>
  )
}

const BookCardDeleteButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
  return (
    <Button 
      ref={ref}
      variant="secondary" 
      size="icon" 
      className="cursor-pointer size-8 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
      {...props}
    >
      <Trash2 />
    </Button>
  )
});

function BookCardDeleteDialog({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const { t, i18n } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <BookCardDeleteButton />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${ i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}> {t('deletion_confirmation_heading')} </AlertDialogTitle>
          <AlertDialogDescription className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}> {t('deletion_confirmation_description')} </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer"> {t('cancel')} </AlertDialogCancel>
          <AlertDialogAction className="gradient-button cursor-pointer" onClick={() => onDelete(id)}> {t('continue')} </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function BookCard({ id, date, title, authorName, authorDeathDate, onDelete, onBookAdded }: { 
  id: number, 
  date: number,
  title: string, 
  authorName: string, 
  authorDeathDate?: number,
  onDelete: (id: number) => void,
  onBookAdded?: () => void 
}) {
  const { i18n } = useTranslation();

  return (
    <Card key={id} className="p-4 border hover:shadow-md hover:border-emerald-500/60 hover:shadow-emerald-500/40 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center">
        <Link to={`/books/${id}`} className="flex-1 cursor-pointer">
          <div className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            <BookCardTitle title={title} />
            <div className="flex items-center text-center gap-2">
              <BookCardAuthor authorName={authorName} authorDeathDate={authorDeathDate} />
              <BookCardDate timestamp={date} locale={i18n.language} />
            </div>
          </div>
        </Link>
        <div className="flex gap-2 ml-4">
          <BookCardDuplicateButton title={title} authorName={authorName} onBookAdded={onBookAdded} />
          <BookCardDeleteDialog id={id} onDelete={onDelete} />
        </div>
      </div>
    </Card>
  );
}

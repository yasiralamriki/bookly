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
import { UsersRound, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";

function AuthorCardName({ name }: { name: string }) {
  return (
    <h3 className="font-semibold text-lg">{name}</h3>
  )
}

interface AuthorCardDuplicateButtonProps {
  name: string;
  onAuthorAdded?: () => void;
}

function AuthorCardDuplicateButton({ name, onAuthorAdded }: AuthorCardDuplicateButtonProps) {
  const [newName, setName] = useState(name);

  const handleDuplicateAuthor = async () => {
    if (!newName.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newName.trim()
        })
      });

      if (response.ok) {
        // Clear form
        setName("");

        // Refresh the authors list
        if (onAuthorAdded) {
          onAuthorAdded();
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
      className={`cursor-pointer size-8 dark:hover:bg-zinc-50 dark:hover:text-black hover:bg-zinc-950 hover:text-white transition duration-300 ease-in-out`}
      onClick={handleDuplicateAuthor}
    >
      <UsersRound />
    </Button>
  )
}

const AuthorCardDeleteButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
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

function AuthorCardDeleteDialog({ id, onDelete }: { id: number, onDelete: (id: number) => void }) {
  const { t, i18n } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AuthorCardDeleteButton />
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

export function AuthorCard({ id, name, onDelete, onAuthorAdded }: { 
  id: number, 
  name: string, 
  onDelete: (id: number) => void,
  onAuthorAdded?: () => void 
}) {
  const { i18n } = useTranslation();

  return (
    <Card key={id} className="p-4 border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <Link to={`/authors/${id}`} className="flex-1 cursor-pointer">
          <div className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            <AuthorCardName name={name} />
          </div>
        </Link>
        <div className="flex gap-2 ml-4">
          <AuthorCardDuplicateButton name={name} onAuthorAdded={onAuthorAdded} />
          <AuthorCardDeleteDialog id={id} onDelete={onDelete} />
        </div>
      </div>
    </Card>
  );
}

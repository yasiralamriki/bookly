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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Calendar, User, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Locale from "@/lib/locale";

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
      variant="outline"
      size="icon"
      className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={handleDuplicateAuthor}
    >
      <UsersRound className="size-4" />
    </Button>
  )
}

const AuthorCardDeleteButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
  return (
    <Button 
      ref={ref}
      variant="outline" 
      size="icon" 
      className="cursor-pointer bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
      {...props}
    >
      <Trash2 className="size-4" />
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
          <AlertDialogAction className="cursor-pointer bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 transition-colors duration-200" onClick={() => onDelete(id)}> {t('continue')} </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function AuthorCard({ id, name, deathDate, onDelete, onAuthorAdded }: { 
  id: number, 
  name: string,
  deathDate?: number,
  onDelete: (id: number) => void,
  onAuthorAdded?: () => void 
}) {
  const { t, i18n } = useTranslation();

  return (
    <Card key={id} className="group relative p-0 border border-border/50 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 ease-out overflow-hidden">
      {/* Left colored stripe */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6 flex items-center justify-between">
        <Link to={`/authors/${id}`} className="flex-1 cursor-pointer">
          <div className={`flex items-center gap-4 ${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-12 w-12 ring-2 ring-emerald-200 dark:ring-emerald-700/50 group-hover:ring-emerald-300 dark:group-hover:ring-emerald-600 transition-all duration-300">
                <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-lg group-hover:from-emerald-200 group-hover:to-emerald-300 dark:group-hover:from-emerald-800 dark:group-hover:to-emerald-700 transition-all duration-300">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 truncate">
                  {name}
                </h3>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs font-medium border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700/50">
                  {t("author")}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-emerald-500 flex-shrink-0" />
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  {typeof deathDate === "number" ? (
                    <>
                      {t("author_death_date")}: <span className="font-normal">{Locale.formatDeathDate(deathDate, i18n.language)}</span>
                    </>
                  ) : (
                    <span className="italic opacity-75">{t("author_death_date_unknown")}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Action Buttons */}
        <div className="flex gap-2 ml-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          <AuthorCardDuplicateButton name={name} onAuthorAdded={onAuthorAdded} />
          <AuthorCardDeleteDialog id={id} onDelete={onDelete} />
        </div>
      </div>
    </Card>
  );
}

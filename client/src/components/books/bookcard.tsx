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
import { BookCopy, Trash2, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef, useState } from "react";

function BookCardTitle({ title }: { title: string }) {
	return (
		<h3 className="font-semibold text-lg">{title}</h3>
	)
}

function BookCardAuthor({ author }: { author: string }) {
	return (
		<div className="flex items-center text-center gap-1">
			<UserRound size={16} className="flex-shrink-0" />
			<p className="text-sm font-normal text-muted-foreground"> {author} </p>
		</div>
	)
}

interface BookCardDuplicateButtonProps {
	title: string;
	author: string;
	id: number;
	onBookAdded?: () => void;
}

function BookCardDuplicateButton({ title, author, id, onBookAdded }: BookCardDuplicateButtonProps) {
	const [newTitle, setTitle] = useState(title);
	const [newAuthor, setAuthor] = useState(author);

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
					author: newAuthor.trim(),
					id: id + 1
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
			className={`cursor-pointer size-8 dark:hover:bg-zinc-50 dark:hover:text-black hover:bg-zinc-950 hover:text-white transition duration-300 ease-in-out`}
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

export function BookCard({ id, title, author, onDelete, onBookAdded }: { 
    id: number, 
    title: string, 
    author: string, 
    onDelete: (id: number) => void,
    onBookAdded?: () => void 
}) {
    const { i18n } = useTranslation();

	return (
		<Card key={id} className="p-4 border hover:shadow-md transition-shadow cursor-pointer">
			<div className="flex justify-between items-start">
				<div className={`mr-4 ${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
					<BookCardTitle title={title} />
					<BookCardAuthor author={author} />
				</div>
				<div className="flex gap-2">
					<BookCardDuplicateButton title={title} author={author} id={id} onBookAdded={onBookAdded} />
					<BookCardDeleteDialog id={id} onDelete={onDelete} />
				</div>
			</div>
		</Card>
	);
}

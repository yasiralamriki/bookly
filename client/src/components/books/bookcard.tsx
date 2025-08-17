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

// Utility function for locale-aware date formatting
function formatDateByLocale(timestamp: number, locale: string, t: (key: string) => string): string {
	if (!timestamp) return t('no_date');
	
	try {
		const date = new Date(timestamp);
		
		// Check if date is valid
		if (isNaN(date.getTime())) {
			return t('invalid_date');
		}
		
		// Configure date formatting options based on locale
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		};
		
		// Use Intl.DateTimeFormat for proper locale support
		return new Intl.DateTimeFormat(locale, options).format(date);
	} catch (error) {
		console.error('Error formatting date:', error);
		return t('invalid_date');
	}
}

function BookCardTitle({ title }: { title: string }) {
	return (
		<h3 className="font-semibold text-lg">{title}</h3>
	)
}

function BookCardAuthor({ author }: { author: string }) {
	return (
		<div className="flex items-center text-center gap-1">
			<UserRound size={16} className="flex-shrink-0" />
			<p className="text-sm font-normal text-muted-foreground">{author}</p>
		</div>
	)
}

function BookCardDate({ timestamp, locale }: { timestamp: number, locale: string }) {
	const { t } = useTranslation();
	const formattedDate = formatDateByLocale(timestamp, locale, t);
	
	return (
		<div className="flex items-center text-center gap-1">
			<CalendarClock size={16} className="flex-shrink-0" />
			<p className="text-sm font-normal text-muted-foreground">{formattedDate}</p>
		</div>
	)
}

interface BookCardDuplicateButtonProps {
	title: string;
	author: string;
	onBookAdded?: () => void;
}

function BookCardDuplicateButton({ title, author, onBookAdded }: BookCardDuplicateButtonProps) {
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

export function BookCard({ id, date, title, author, onDelete, onBookAdded }: { 
    id: number, 
	date: number,
    title: string, 
    author: string, 
    onDelete: (id: number) => void,
    onBookAdded?: () => void 
}) {
    const { i18n } = useTranslation();

	return (
		<Card key={id} className="p-4 border hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start">
				<Link to={`/books/${id}`} className="flex-1 cursor-pointer">
					<div className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
						<BookCardTitle title={title} />
						<div className="flex items-center text-center gap-2">
							<BookCardAuthor author={author} />
							<BookCardDate timestamp={date} locale={i18n.language} />
						</div>
					</div>
				</Link>
				<div className="flex gap-2 ml-4">
					<BookCardDuplicateButton title={title} author={author} onBookAdded={onBookAdded} />
					<BookCardDeleteDialog id={id} onDelete={onDelete} />
				</div>
			</div>
		</Card>
	);
}

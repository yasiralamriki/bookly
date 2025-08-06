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
import { Trash2, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

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

export function BookCard({ id, title, author, onDelete }: { id: number, title: string, author: string, onDelete: (id: number) => void }) {
    const { i18n } = useTranslation();

	return (
		<Card key={id} className="p-4 border hover:shadow-md transition-shadow cursor-pointer">
			<div className="flex justify-between items-start">
				<div className={`mr-4 ${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
					<BookCardTitle title={title} />
					<BookCardAuthor author={author} />
				</div>
				<BookCardDeleteDialog id={id} onDelete={onDelete} />
			</div>
		</Card>
	);
}

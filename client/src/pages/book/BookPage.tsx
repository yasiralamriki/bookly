import "../../App.css"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, forwardRef } from "react";
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { BookCopy, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookData {
  id: number;
  title: string;
  author: string;
  // add other fields as needed
}

interface BookDuplicateButtonProps {
  title: string;
  author: string;
}

function handleDeleteBook(bookId: number) {
  return fetch(`/api/books?id=${bookId}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      // Success - let the component handle navigation
      return true;
    })
    .catch(error => {
      console.error('Error deleting book:', error);
      throw error; // Re-throw so the calling component can handle it
    });
}

function BookDuplicateButton({ title, author }: BookDuplicateButtonProps) {
  const [newTitle, setTitle] = useState(title);
  const [newAuthor, setAuthor] = useState(author);

  const { t } = useTranslation();

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
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={handleDuplicateBook}
    >
      <BookCopy />
      {t("duplicate_book")}
    </Button>
  )
}

const BookDeleteButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
  const { t } = useTranslation();

  return (
    <Button
      ref={ref}
      variant="destructive"
      className="cursor-pointer"
      {...props}
    >
      <Trash2 />
      {t("delete_book")}
    </Button>
  )
});

function BookDeleteDialog({ id }: { id: number }) {
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await handleDeleteBook(id);
      // Navigate back to home page after successful deletion
      navigate('/');
    } catch (error) {
      console.error('Failed to delete book:', error);
      // Optionally show user feedback here
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <BookDeleteButton />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
					<AlertDialogTitle className={`${ i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}> {t('deletion_confirmation_heading')} </AlertDialogTitle>
					<AlertDialogDescription className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}> {t('deletion_confirmation_description')} </AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer"> {t('cancel')} </AlertDialogCancel>
					<AlertDialogAction className="gradient-button cursor-pointer" onClick={handleDelete}> {t('continue')} </AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function BookPage() {
  const params = useParams();
  const [data, setData] = useState<BookData | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(`/api/books?id=${params.bookId}`)
      .then(response => response.json())
      .then(fetchedData => {
        setData(fetchedData);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, [params.bookId]);

  return (
    <div className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start gap-8 overflow-hidden">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">{t('books')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className={i18n.dir() === "rtl" ? "rotate-180" : ""}></BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/books/${params.bookId?.toString()}`}>{data ? data.title : "Loading..."}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
      <Card className="flex-1 self-stretch px-8 py-8 border hover:shadow-md transition-shadow text-start gap-4">
          <h1 className="text-2xl font-bold">{t("book_info")}</h1>
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">{data ? `${t("book")}: ${data.title}` : "Loading..."}</h2>
            <h3 className="text-md font-normal">{data ? `${t("author")}: ${data.author}` : ""}</h3>
          </div>
          <Separator/>
          <h1 className="text-2xl font-bold">{t("book_actions")}</h1>
          <div className="flex flex-row gap-2">
            {data && (
              <>
                <BookDuplicateButton title={data.title} author={data.author} />
                <BookDeleteDialog id={data.id} />
              </>
            )}
          </div>
      </Card>
    </div>
  )
}
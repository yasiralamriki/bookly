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
import { UsersRound, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthorData {
  id: number;
  name: string;
  // add other fields as needed
}

interface BookData {
  id: number;
  title: string;
  // add other fields as needed
}

interface AuthorDuplicateButtonProps {
  name: string;
  author: string;
}

function handleDeleteAuthor(authorId: number) {
  return fetch(`/api/authors?id=${authorId}`, { method: 'DELETE' })
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
      console.error('Error deleting author:', error);
      throw error; // Re-throw so the calling component can handle it
    });
}

function AuthorDuplicateButton({ name }: AuthorDuplicateButtonProps) {
  const [newName, setName] = useState(name);
  const { t } = useTranslation();

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
          name: newName.trim(),
        })
      });

      if (response.ok) {
        // Clear form
        setName("");
      }
    } catch (error) {
      console.error('Error adding author:', error);
    }
  };

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={handleDuplicateAuthor}
    >
      <UsersRound />
      {t("duplicate_author")}
    </Button>
  )
}

const AuthorDeleteButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
  const { t } = useTranslation();

  return (
    <Button
      ref={ref}
      variant="destructive"
      className="cursor-pointer"
      {...props}
    >
      <Trash2 />
      {t("delete_author")}
    </Button>
  )
});

function AuthorDeleteDialog({ id }: { id: number }) {
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await handleDeleteAuthor(id);
      // Navigate back to home page after successful deletion
      navigate('/authors');
    } catch (error) {
      console.error('Failed to delete author:', error);
      // Optionally show user feedback here
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AuthorDeleteButton />
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

export default function AuthorPage() {
  const params = useParams();
  const [data, setData] = useState<AuthorData | null>(null);
  const [books, setBooks] = useState<BookData[] | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(`/api/authors?id=${params.authorId}`)
      .then(response => response.json())
      .then(fetchedData => {
        setData(fetchedData);
      })
      .catch(error => console.error('Error fetching authors:', error));

    fetch(`/api/books`)
      .then(response => response.json())
      .then(fetchedBooks => {
        for (const book of fetchedBooks) {
          if (book.author === data?.name) {
            setBooks(prevBooks => [...(prevBooks || []), book]);
          }
        }
      })
      .catch(error => console.error('Error fetching author books:', error));

  }, [params.authorId, data?.name]);

  return (
    <div className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start gap-8 overflow-hidden">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">{t('authors')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className={i18n.dir() === "rtl" ? "rotate-180" : ""}></BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/authors/${params.authorId?.toString()}`}>{data ? data.name : "Loading..."}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
      <Card className="flex-1 self-stretch px-8 py-8 border hover:shadow-md transition-shadow text-start gap-4">
          <h1 className="text-2xl font-bold">{t("author_info")}</h1>
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">{data ? `${t("author")}: ${data.name}` : "Loading..."}</h2>
            <h2 className="text-lg font-medium whitespace-pre-line">
              {t("books")}: {books && books.length > 0 ? `\n${books.map((book, index) => `${index + 1}. ${book.title}`).join("\n")}` : "Loading..."}
            </h2>
          </div>
          <Separator/>
          <h1 className="text-2xl font-bold">{t("author_actions")}</h1>
          <div className="flex flex-row gap-2">
            {data && (
              <>
                <AuthorDuplicateButton name={data.name} author={data.name} />
                <AuthorDeleteDialog id={data.id} />
              </>
            )}
          </div>
      </Card>
    </div>
  )
}
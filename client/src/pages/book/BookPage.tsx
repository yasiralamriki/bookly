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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookCopy, SquarePen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as Locale from "@/lib/locale";
import { Textarea } from "@/components/ui/textarea";

interface BookData {
  id: number;
  title: string;
  author: string;
  date: number;
  notes: string[];
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(`/api/books?id=${params.bookId}`)
      .then(response => response.json())
      .then(fetchedData => {
        setData(fetchedData);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, [params.bookId]);

  async function updateNotes(newNotes: string[]) {
    if (!data) return;
    
    try {
      const response = await fetch(`/api/books?id=${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: data.title.trim(),
          author: data.author.trim(),
          notes: newNotes
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error updating book notes:', error);
    }
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start gap-4 overflow-hidden">
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
      {/* Make Tabs and TabsContent stretch vertically */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0 gap-4">
          <TabsList className="!bg-transparent gap-2">
            <TabsTrigger value="info" className="cursor-pointer !bg-transparent hover:!bg-emerald-800 hover:!text-white transition-all duration-300 ease-in-out data-[state=active]:!bg-transparent data-[state=active]:!border-emerald-500">{t("book_info")}</TabsTrigger>
            <TabsTrigger value="notes" className="cursor-pointer !bg-transparent hover:!bg-emerald-800 hover:!text-white transition-all duration-300 ease-in-out data-[state=active]:!bg-transparent data-[state=active]:!border-emerald-500">{t("book_notes")}</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col self-stretch px-8 py-8 border bg-transparent hover:text-accent-foreground hover:shadow-md transition-all text-start gap-4 h-full">
              <h1 className="text-2xl font-bold">{t("book_info")}</h1>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1 items-center">
                  <h2 className="text-lg font-medium">{data ? `${t("book")}: ${data.title}` : "Loading..."}</h2>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="!w-6 !h-6 cursor-pointer">
                        <SquarePen size={8} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px] [&>button]:cursor-pointer [&>button]:hidden'>
                      <DialogHeader>
                        <DialogTitle className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>{t("edit_book_name")}</DialogTitle>
                        <DialogDescription className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>{t("edit_book_name_description")}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3">
                        <Label htmlFor="book_name">{t("book_name")}</Label>
                        <Input id="book_name" name="name" defaultValue={data ? data.title : "Book Name"} />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" className="cursor-pointer">{t("cancel")}</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="cursor-pointer gradient-button"
                          onClick={async (e) => {
                            e.preventDefault();
                            const response = await fetch(`/api/books?id=${data ? data.id : ""}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                id: data ? data.id : 1,
                                title: (document.getElementById('book_name') as HTMLInputElement).value,
                                author: data ? data.author : "Unknown Author",
                              }),
                            });
                            
                            if (response.ok) {
                              // Refresh the data after successful update
                              const updatedData = await response.json();
                              setData(updatedData);
                              // Close the dialog after successful update
                              setIsEditDialogOpen(false);
                            }
                          }}
                        >
                          {t("continue")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <h3 className="text-md font-normal">{data ? `${t("author")}: ${data.author}` : ""}</h3>
                <h3 className="text-md font-normal">{data ? `${t("date")}: ${Locale.formatDateByLocale(data.date, i18n.language, t)}` : ""}</h3>
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
          </TabsContent>
          <TabsContent value="notes" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col self-stretch px-8 py-8 border bg-transparent hover:text-accent-foreground hover:shadow-md transition-all text-start gap-4 h-full">
              <h1 className="text-2xl font-bold">{t("book_notes")}</h1>
              <div className="flex flex-col flex-1 h-full">
                <Textarea
                  className="resize-none flex-1 h-full w-full !bg-transparent"
                  placeholder={t("book_notes_placeholder")}
                  defaultValue={data ? data.notes.join("\n") : ""}
                  onChange={(e) => {
                    const newNotes = e.target.value.split("\n");
                    updateNotes(newNotes);
                  }}
                ></Textarea>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
import "../../App.css"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { BookCopy, SquarePen, Trash2, Calendar, Icon, FileText, BookOpen, BookCheck } from "lucide-react";
import { featherText } from "@lucide/lab";
import { useTranslation } from "react-i18next";
import * as Locale from "@/lib/locale";
import { Textarea } from "@/components/ui/textarea";

interface BookData {
  id: number;
  title: string;
  author: string;
  date: number;
  notes: string[];
  completed: boolean;
  tags: string[];
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
      className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={handleDuplicateBook}
    >
      <BookCopy className="h-4 w-4 mr-2" />
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
      className="cursor-pointer bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
      {...props}
    >
      <Trash2 className="h-4 w-4 mr-2" />
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
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            {t('deletion_confirmation_heading')}
          </AlertDialogTitle>
          <AlertDialogDescription className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            {t('deletion_confirmation_description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            className="cursor-pointer bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
            onClick={handleDelete}
          >
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function BookPageSkeleton() {
  const { t } = useTranslation();
  
  return (
    <div className="h-[calc(100vh-4.5rem)] px-4 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 lg:py-32 flex flex-col justify-start gap-6 overflow-hidden">
      {/* Enhanced Breadcrumb Skeleton */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors font-medium"
                >
                  <BookOpen className="h-4 w-4" />
                  {t('books')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-emerald-400 dark:text-emerald-600" />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-32" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0 gap-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-black/40 backdrop-blur-sm rounded-lg p-1 h-auto border border-border/50 dark:border-emerald-500/20">
            <TabsTrigger 
              value="info" 
              className="cursor-pointer data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-300 dark:data-[state=active]:border-emerald-500/30 data-[state=active]:shadow-sm transition-all duration-200 py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <BookOpen className="h-4 w-4" />
              {t("book_info")}
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="cursor-pointer data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-300 dark:data-[state=active]:border-emerald-500/30 data-[state=active]:shadow-sm transition-all duration-200 py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <FileText className="h-4 w-4" />
              {t("book_notes")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-emerald-500" />
                    {t("book_info")}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <FileText className="h-3 w-3 mr-1" />
                    {t("book")}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6">
                {/* Book Details Section */}
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                        <Skeleton className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon iconNode={featherText} className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <SquarePen className="h-5 w-5 text-emerald-500" />
                    {t("book_actions")}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function BookPage() {
  const params = useParams();
  const [data, setData] = useState<BookData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/books?id=${params.bookId}`)
      .then(response => response.json())
      .then(fetchedData => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setIsLoading(false);
      });
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

  async function updateBookStatus(completedStatus: boolean) {
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
          completed: completedStatus
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  }

  if (isLoading) {
    return <BookPageSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] px-4 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 lg:py-32 flex flex-col justify-start gap-6 overflow-hidden book-page-fade-in">
      {/* Enhanced Breadcrumb */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors font-medium"
                >
                  <BookOpen className="h-4 w-4" />
                  {t('books')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={`text-emerald-400 dark:text-emerald-600 ${i18n.dir() === "rtl" ? "rotate-180" : ""}`} />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to={`/books/${params.bookId?.toString()}`} 
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium truncate max-w-[200px] md:max-w-none"
                  title={data ? data.title : "Loading..."}
                >
                  {data ? data.title : "Loading..."}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Enhanced Tabs Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0 gap-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-black/40 backdrop-blur-sm rounded-lg p-1 h-auto border border-border/50 dark:border-emerald-500/20">
            <TabsTrigger 
              value="info" 
              className="cursor-pointer data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-300 dark:data-[state=active]:border-emerald-500/30 data-[state=active]:shadow-sm transition-all duration-200 py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <BookOpen className="h-4 w-4" />
              {t("book_info")}
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="cursor-pointer data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-300 dark:data-[state=active]:border-emerald-500/30 data-[state=active]:shadow-sm transition-all duration-200 py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <FileText className="h-4 w-4" />
              {t("book_notes")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 book-card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="responsive-text-2xl font-bold flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-emerald-500" />
                    {t("book_info")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {data?.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700/50"
                      >
                        {tag ?.toLowerCase() === "book" ? <FileText className="h-3 w-3 mr-1" /> : <BookOpen className="h-3 w-3 mr-1" />}
                        {tag ?.toLowerCase() === "book" ? t("book") : tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6">
                {/* Enhanced Book Details Section */}
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    <Avatar className="h-16 w-16 ring-2 ring-emerald-200 dark:ring-emerald-700">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100 font-semibold text-lg">
                        {data?.title ? data.title.charAt(0).toUpperCase() : 'B'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-1">
                        <h2 className="responsive-text-xl font-bold text-foreground">{data?.title || "Unknown Title"}</h2>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors">
                              <SquarePen className="h-4 w-4" />
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
                                    const updatedData = await response.json();
                                    setData(updatedData);
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
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon iconNode={featherText} className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{t("author")}:</span>
                        <span>{data?.author || "Unknown Author"}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{t("date")}:</span>
                        <span>{data ? Locale.formatDateByLocale(data.date, i18n.language, t) : "Unknown Date"}</span>
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{t("status")}:</span>
                        <span>{data ? (data.completed ? t('book_completed') : t('book_not_completed')) : "Unknown Status"}</span>
                      </div>

                      <div className="flex items-center text-muted-foreground">
                        <Button 
                          variant="outline" 
                          className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={
                            updateBookStatus.bind(null, !data?.completed)
                            
                          }
                        >
                          <BookCheck className="h-4 w-4 mr-2" />
                          {data?.completed ? t("mark_book_as_not_completed") : t("mark_book_as_completed")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Enhanced Actions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <SquarePen className="h-5 w-5 text-emerald-500" />
                    {t("book_actions")}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {data && (
                      <>
                        <BookDuplicateButton title={data.title} author={data.author} />
                        <BookDeleteDialog id={data.id} />
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 book-card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="responsive-text-2xl font-bold flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  {t("book_notes")}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 relative">
                  <Textarea
                    className="resize-none absolute inset-0 w-full h-full bg-transparent border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40 focus:border-emerald-500/60 focus:border-solid focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-emerald-500/60 focus-visible:outline-none transition-all duration-200 rounded-lg p-4 focus:outline-none focus:bg-emerald-50/20 dark:focus:bg-emerald-950/20 placeholder:text-muted-foreground/60 !ring-0 !ring-offset-0"
                    placeholder={t("book_notes_placeholder")}
                    defaultValue={data ? data.notes.join("\n") : ""}
                    onChange={(e) => {
                      const newNotes = e.target.value.split("\n");
                      updateNotes(newNotes);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
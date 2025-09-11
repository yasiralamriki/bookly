import "../../App.css"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { UsersRound, Trash2, User, Book, Calendar, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as Locale from "@/lib/locale";

interface AuthorData {
  id: number;
  name: string;
  deathDate: string | null;
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
      className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={handleDuplicateAuthor}
    >
      <UsersRound className="h-4 w-4 mr-2" />
      {t("duplicate_author")}
    </Button>
  )
}

function AuthorDeleteDialog({ id }: { id: number }) {
  const { t, i18n } = useTranslation();
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
        <Button 
          variant="destructive"
          className="cursor-pointer bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t("delete_author")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            {t('deletion_confirmation_heading')}
          </AlertDialogTitle>
          <AlertDialogDescription className={`${i18n.dir(i18n.language) === 'rtl' ? 'text-right' : 'text-left'}`}>
            {t('deletion_confirmation_description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="cursor-pointer bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AuthorPage() {
  const params = useParams();
  const [data, setData] = useState<AuthorData | null>(null);
  const [books, setBooks] = useState<BookData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/authors?id=${params.authorId}`)
      .then(response => response.json())
      .then(fetchedData => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching authors:', error);
        setIsLoading(false);
      });

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

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4.5rem)] px-4 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 lg:py-32 flex flex-col justify-start gap-6 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    to="/authors" 
                    className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors font-medium"
                  >
                    <UsersRound className="h-4 w-4" />
                    {t('authors')}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className={`text-emerald-400 dark:text-emerald-600 ${i18n.dir() === "rtl" ? "rotate-180" : ""}`} />
              <BreadcrumbItem>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] px-4 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 lg:py-32 flex flex-col justify-start gap-6 overflow-hidden">
      {/* Enhanced Breadcrumb */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to="/authors" 
                  className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors font-medium"
                >
                  <UsersRound className="h-4 w-4" />
                  {t('authors')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={`text-emerald-400 dark:text-emerald-600 ${i18n.dir() === "rtl" ? "rotate-180" : ""}`} />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/authors/${params.authorId?.toString()}`} className="text-emerald-600 dark:text-emerald-400">
                  {data ? data.name : "Loading..."}
                </Link>
              </BreadcrumbLink>
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
              <User className="h-4 w-4" />
              {t("author_info")}
            </TabsTrigger>
            <TabsTrigger 
              value="books" 
              className="cursor-pointer data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-300 dark:data-[state=active]:border-emerald-500/30 data-[state=active]:shadow-sm transition-all duration-200 py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <Book className="h-4 w-4" />
              {t("books")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="responsive-text-2xl font-bold flex items-center gap-3">
                    <User className="h-6 w-6 text-emerald-500" />
                    {t("author_info")}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700">
                    <User className="h-3 w-3 mr-1" />
                    {t("author")}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6">
                {/* Enhanced Author Details Section */}
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    <Avatar className="h-16 w-16 ring-2 ring-emerald-200 dark:ring-emerald-700">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100 font-semibold text-lg">
                        {data?.name ? data.name.charAt(0).toUpperCase() : 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h2 className="responsive-text-xl font-bold text-foreground">{data?.name || "Unknown Author"}</h2>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{t("author")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">
                          {t("author_death_date")}: {data
                            ? (data.deathDate && !isNaN(Number(data.deathDate))
                                ? data.deathDate
                                : t("author_death_date_unknown"))
                            : "Loading..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <SquarePen className="h-5 w-5 text-emerald-500" />
                    {t("author_actions")}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {data && (
                      <>
                        <AuthorDuplicateButton name={data.name} author={data.name} />
                        <AuthorDeleteDialog id={data.id} />
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="books" className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="responsive-text-2xl font-bold flex items-center gap-3">
                    <Book className="h-6 w-6 text-emerald-500" />
                    {t("books")}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700">
                    <Book className="h-3 w-3 mr-1" />
                    {books?.length || 0} {t("books")}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ScrollArea className="h-[280px]">
                  <div className="space-y-4 pr-4">
                    {books && books.length > 0 ? (
                      books.map((book, index) => (
                        <div key={book.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                            <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 text-xs font-bold">
                              {Locale.formatNumberByLocale(index + 1, i18n.language)}
                            </Badge>
                          </div>
                          <Book className="h-5 w-5 text-emerald-500" />
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/books/${book.id}`}
                              className="text-lg font-semibold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                              {book.title}
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Book className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">{t("no_books_found")}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
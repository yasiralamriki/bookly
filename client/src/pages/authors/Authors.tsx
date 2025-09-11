import "../../app.css"
import { useEffect, useState } from "react";
import { User, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { NewAuthorButton } from "@/components/authors/newauthorbutton";
import { AuthorSearchBar } from "@/components/authors/authorsearchbar";
import { AuthorsFilter } from "@/components/authors/authorsfilter";
import { AuthorCard } from "@/components/authors/authorcard";
import { useTranslation } from "react-i18next";
import * as Locale from "@/lib/locale";

type Author = {
  id: number;
  name: string;
  deathDate?: number;
};

function NoAuthorsAlert() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex justify-center items-center p-8">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
          <User className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{t("no_authors_found")}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{t("no_authors_match_criteria")}</p>
        </div>
      </div>
    </div>
  );
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation();

  const fetchAuthors = () => {
    fetch('/api/authors')
      .then(response => response.json())
      .then(data => {
        setAuthors(data);
        setFilteredAuthors(data);
      })
      .catch(error => console.error('Error fetching authors:', error));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    // Filter and sort authors when search query or sort order changes
    const filtered = authors.filter(author => {
      // If search query is empty, show all authors
      if (!searchQuery.trim()) return true;
      
      // Helper function to check if text contains search query using localeCompare base sensitivity
      const containsQuery = (text: string, query: string): boolean => {
        // Check if any part of the text matches the query using localeCompare
        for (let i = 0; i <= text.length - query.length; i++) {
          const substring = text.substring(i, i + query.length);
          if (substring.localeCompare(query, undefined, { sensitivity: 'base' }) === 0) {
            return true;
          }
        }
        return false;
      };

      return containsQuery(author.name, searchQuery);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "ascending") {
        return a.name.localeCompare(b.name, undefined, { usage: "sort", sensitivity: 'base' });
      } else {
        return b.name.localeCompare(a.name, undefined, { usage: "sort", sensitivity: 'base' });
      }
    });

    setFilteredAuthors(sorted);
  }, [authors, searchQuery, sortOrder]);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleDeleteAuthor = async (authorId: number) => {
    try {
      const response = await fetch(`/api/authors/?id=${authorId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove the author from the local state
        const updatedAuthors = authors.filter(author => author.id !== authorId);
        setAuthors(updatedAuthors);
      }
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] px-4 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 lg:py-32 flex flex-col justify-start gap-6 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-6 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <UsersRound className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("authors")}</h1>
              <p className="text-sm text-muted-foreground">
                {filteredAuthors.length} {filteredAuthors.length === 1 ? t("author") : t("authors")}
                {searchQuery && ` • ${t("filtered_results")}`}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700">
            <User className="w-3 h-3 mr-1" />
            {Locale.formatNumberByLocale(filteredAuthors.length, i18n.language)}
          </Badge>
        </div>
        
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <AuthorSearchBar 
              searchQuery={searchQuery} 
              handleSearchChange={handleSearchChange} 
            />
            <AuthorsFilter
              sortOrder={sortOrder}
              handleSortChange={handleSortChange} 
            />
          </div>
          <NewAuthorButton onAuthorAdded={fetchAuthors} />
        </div>
      </div>

      {/* Authors Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 min-h-0">
          {filteredAuthors.length === 0 ? (
            <NoAuthorsAlert />
          ) : (
            <CardContent className="flex-1 p-6 min-h-0">
              <ScrollArea className="h-full w-full scrollbar-hide">
                <div className="space-y-4">
                  {filteredAuthors.map((author) => (
                    <AuthorCard
                      key={author.id}
                      id={author.id}
                      name={author.name}
                      deathDate={author.deathDate}
                      onDelete={handleDeleteAuthor}
                      onAuthorAdded={fetchAuthors}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
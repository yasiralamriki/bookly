import "../../app.css"
import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NewAuthorButton } from "@/components/authors/newauthorbutton";
import { AuthorSearchBar } from "@/components/authors/authorsearchbar";
import { AuthorsFilter } from "@/components/authors/authorsfilter";
import { AuthorCard } from "@/components/authors/authorcard";
import { useTranslation } from "react-i18next";

type Author = {
  id: number;
  name: string;
  // add other fields if needed
};

function NoAuthorsAlert() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex-1 flex justify-center items-center">
      <Alert variant="destructive" className={`text-left max-w-md ${i18n.dir(i18n.language) === "rtl" ? "text-right" : "text-left"}`}>
        <CircleAlert className="mx-auto" />
        <AlertTitle>{t("no_authors_found")}</AlertTitle>
        <AlertDescription>{t("no_authors_match_criteria")}</AlertDescription>
      </Alert>
    </div>
  );
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");

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
    <div id="main" className="h-[calc(100vh-4.5rem)] px-64 py-32 flex flex-col justify-start items-center gap-8 overflow-hidden">
      <div id="main-container" className="self-stretch flex-1 inline-flex flex-col justify-start items-start gap-4 min-h-0">
        <div id="control-container" className="self-stretch inline-flex justify-between items-center">
          <div id="search-container" className="inline-flex justify-start items-center gap-4">
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
        <Card id="books-container" className="self-stretch flex-1 p-8 flex flex-col min-h-0 overflow-hidden">
          {filteredAuthors.length === 0 ? (
            <NoAuthorsAlert />
          ) : (
            <ScrollArea className="flex-1 w-full h-0">
              <div className="flex flex-col justify-start items-stretch gap-4 pr-4">
                {filteredAuthors.map((author) => (
                  <AuthorCard
                    key={author.id}
                    id={author.id}
                    name={author.name}
                    onDelete={handleDeleteAuthor}
                    onAuthorAdded={fetchAuthors}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  )
}
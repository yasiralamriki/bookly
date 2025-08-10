import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

interface BookData {
  title: string;
  author: string;
  // add other fields as needed
}

export default function BookPage() {
  const params = useParams();
  const [data, setData] = useState<BookData | null>(null);
  const { t } = useTranslation();

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
            <Link to="/">Books</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator></BreadcrumbSeparator>
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
          <div className="flex flex-col gap-2">
            <p>Placeholder</p>
          </div>
      </Card>
    </div>
  )
}
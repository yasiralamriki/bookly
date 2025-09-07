import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AuthorsFilter({ sortOrder, handleSortChange}: { sortOrder: string, handleSortChange: (value: string) => void }) {
  const { t } = useTranslation();

  return (
    <Select defaultValue="ascending" value={sortOrder} onValueChange={handleSortChange}>
      <SelectTrigger className="!h-10 cursor-pointer">
        <SelectValue placeholder="Sort By"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ascending" className="cursor-pointer">
          <ArrowDownAZ />
          {t("ascending")}
        </SelectItem>
        <SelectItem value="descending" className="cursor-pointer">
          <ArrowUpZA />
          {t("descending")}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
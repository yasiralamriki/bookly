import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { useTranslation } from "react-i18next";

export function BookSearchBar({ searchQuery, handleSearchChange }: { searchQuery: string; handleSearchChange: (value: string) => void }) {
  const { t } = useTranslation();

  return (
    <Command className="w-64 h-10 bg-transparent border-input border rounded-md shadow-xs [&>[data-slot=command-input-wrapper]]:border-none">
      <CommandInput
        placeholder={t("search_for_books")}
        value={searchQuery}
        onValueChange={handleSearchChange}
      />
      <CommandList></CommandList>
    </Command>
  )
}
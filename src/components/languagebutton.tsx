import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageButton() {
    return (
        <Select>
        <SelectTrigger>
            <SelectValue placeholder="Language"></SelectValue>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
        </SelectContent>
        </Select>
    )
}
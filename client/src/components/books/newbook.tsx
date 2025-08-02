import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react";
import { createBook } from "@/lib/books"

export function NewBook() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="cursor-pointer gradient-button">
            <Plus /> New Book
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a new book</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="book-name">Book Name</Label>
            <Input type="text" id="book-name" placeholder="Kitāb at-Tawhīd" />
        </div>
        <div className="grid w-full items-center gap-3">
            <Label htmlFor="author-name">Author Name</Label>
            <Input type="text" id="author-name" placeholder="Shaykh Muhammad ibn 'Abd al-Wahhāb" />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer gradient-button" onClick={() => createBook("Kitāb at-Tawhīd", "Shaykh Muhammad ibn 'Abd al-Wahhāb")}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
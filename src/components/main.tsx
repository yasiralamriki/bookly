import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { Plus, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"

export function Main() {
    return (
        <div id="main" className="h-screen px-48 py-32 flex flex-col justify-start items-center gap-8 overflow-hidden">
            <div id="main-container" className="self-stretch h-full inline-flex flex-col justify-start items-start gap-4">
                <div id="control-container" className="self-stretch inline-flex justify-between items-center">
                    <div id="search-container" className="inline-flex justify-start items-center gap-4">
                        <Command className="w-64 border rounded-md [&>[data-slot=command-input-wrapper]]:h-10 [&>[data-slot=command-input-wrapper]]:border-none">
                            <CommandInput placeholder="Search for books..." />
                            <CommandList></CommandList>
                        </Command>
                    </div>
                    <Button size="lg" className="cursor-pointer">
                        <Plus /> New Book
                    </Button>
                </div>
                <Card id="books-container" className="self-stretch flex-1 p-8 inline-flex flex-col justify-center items-center gap-4 border-dashed bg-transparent">
                    <Alert variant="destructive" className="w-fit max-w-md text-left">
                        <CircleAlert />
                        <AlertTitle>No books found.</AlertTitle>
                        <AlertDescription>
                            <p>Click "Add book" to add a new book.</p>
                        </AlertDescription>
                    </Alert>
                </Card>
            </div>
        </div>
    )
}
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface NewBookProps {
	onBookAdded?: () => void;
}

interface AuthorComboboxProps {
	value: string;
	onValueChange: (value: string) => void;
}

function AuthorCombobox({ value, onValueChange }: AuthorComboboxProps) {
	const [authors, setAuthors] = useState<{ name: string }[]>([]);
	const [open, setOpen] = useState(false);

	const { t } = useTranslation();

	useEffect(() => {
		const fetchAuthors = async () => {
			try {
				const response = await fetch('/api/authors', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await response.json();
				setAuthors(data);
			} catch (error) {
				console.error('Error fetching authors:', error);
			}
		};
		fetchAuthors();
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen} modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full flex-1 justify-between h-11"
				>
					{value
						? authors.find((author) => author.name === value)?.name
						: t('select_author')}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="p-0"
				style={{ width: 'var(--radix-popover-trigger-width)' }}
			>
				<Command>
					<CommandInput
						placeholder={t('search_for_authors')}
						className="h-9"
					/>
					<CommandList className="max-h-[200px]">
						<CommandEmpty>{t('no_authors_found')}</CommandEmpty>
						<CommandGroup>
							{authors.map((author) => (
								<CommandItem
									key={author.name}
									value={author.name}
									onSelect={(currentValue) => {
										onValueChange(
											currentValue === value
												? ''
												: currentValue
										);
										setOpen(false);
									}}
								>
									{author.name}
									<Check
										className={cn(
											'ml-auto',
											value === author.name
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export function NewBookButton({ onBookAdded }: NewBookProps) {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const { t, i18n } = useTranslation();

	const handleAddBook = async () => {
		if (!title.trim() || !author.trim()) {
			return;
		}

		try {
			const response = await fetch('/api/books', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: title.trim(),
					author: author.trim(),
					notes: [],
				}),
			});

			try {
				const data = await fetch('api/authors', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const authors = await data.json();
				// Assuming authors is an array of author names or objects with a 'name' property
				type AuthorType = { name: string } | string;
				const authorExists = Array.isArray(authors)
					? authors.some((a: AuthorType) =>
							typeof a === 'string'
								? a === author.trim()
								: a.name === author.trim()
					  )
					: author.trim() in authors;

				if (!authorExists) {
					// If author doesn't exist, create a new author
					await fetch('/api/authors', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							name: author.trim(),
						}),
					});
				}
			} catch (error) {
				console.error('Error checking/adding author:', error);
			}

			if (response.ok) {
				// Clear form
				setTitle('');
				setAuthor('');
				setIsOpen(false);

				// Refresh the books list
				if (onBookAdded) {
					onBookAdded();
				}
			}
		} catch (error) {
			console.error('Error adding book:', error);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button
					size="lg"
					className="cursor-pointer gradient-button transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 font-medium text-base px-6 py-3 rounded-lg flex items-center gap-3"
				>
					<Plus size={20} className="stroke-[2.5]" />
					<span>{t('new_book')}</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader className="space-y-3">
					<AlertDialogTitle
						className={`text-xl font-semibold ${
							i18n.language === 'ar' ? 'text-right' : 'text-left'
						}`}
					>
						{t('create_book')}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<Label
							htmlFor="book-name"
							className="text-sm font-medium flex items-center gap-1"
						>
							{t('book_name')}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							type="text"
							id="book-name"
							placeholder={`${
								i18n.language === 'ar'
									? 'كتاب التوحيد'
									: 'Kitāb at-Tawhīd'
							}`}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="h-11 transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						/>
					</div>
					<div className="space-y-2">
						<Label
							htmlFor="author-name"
							className="text-sm font-medium flex items-center gap-1"
						>
							{t('author_name')}
							<span className="text-destructive">*</span>
						</Label>
						<AuthorCombobox
							value={author}
							onValueChange={setAuthor}
						/>
					</div>
				</div>
				<AlertDialogFooter className="flex gap-3">
					<AlertDialogCancel className="cursor-pointer flex-1 h-11 font-medium hover:bg-muted transition-colors">
						{t('cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						className="cursor-pointer gradient-button flex-1 h-11 font-medium shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleAddBook}
						disabled={!title.trim() || !author.trim()}
					>
						{t('continue')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

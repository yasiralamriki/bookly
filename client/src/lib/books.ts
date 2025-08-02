import data from '@/data/books.json';
import fs from 'fs';

export function createBook(bookName: string, authorName: string) {
    return "Create book functionality is not implemented yet.";
    
    /*const newBook = {
        id: data.length + 1,
        title: bookName,
        author: authorName
    };

    data.push(newBook);
    fs.writeFileSync('@/data/books.json', JSON.stringify(data, null, 2), 'utf-8');*/
}

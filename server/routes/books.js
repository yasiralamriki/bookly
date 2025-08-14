// Import necessary modules
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Import local modules
import { Book } from '../lib/books.js';
import { getConfigFile } from '../lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router
	.route('/books')
	.get((req, res) => {
    const books = getConfigFile(path.join(__dirname, '../data/books.json'));
    
    if (req.query.id) {
      const book = books.find(book => book.id === parseInt(req.query.id, 10));
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ error: 'Book not found' });
      }
    } else {
      return res.status(200).json(books);
    }
	})
	.post((req, res) => {
    const books = getConfigFile(path.join(__dirname, '../data/books.json'));
    
    // Find the highest existing ID and increment it
    const maxId = books.length > 0 ? Math.max(...books.map(book => book.id)) : 0;
    const newBook = new Book(maxId + 1, req.body.title, req.body.author);

    books.push(newBook);
    fs.writeFileSync(path.join(__dirname, '../data/books.json'), JSON.stringify(books, null, 2));

    res.status(201).json(newBook);
	})
  .delete((req, res) => {
    if (req.query.id) {
      const books = getConfigFile(path.join(__dirname, '../data/books.json'));
      const bookId = parseInt(req.query.id, 10);
      const bookIndex = books.findIndex(book => book.id === bookId);

      if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
      } else {
        const deletedBook = books.splice(bookIndex, 1)[0];

        fs.writeFileSync(path.join(__dirname, '../data/books.json'), JSON.stringify(books, null, 2));
        return res.status(200).json(deletedBook);
      }
    } else {
      res.status(400).json({ error: 'Book ID is required for deletion' });
    }
  })
  .put((req, res) => {
    if (req.query.id) {
      const books = getConfigFile(path.join(__dirname, '../data/books.json'));
      const bookId = parseInt(req.query.id, 10);
      const bookIndex = books.findIndex(book => book.id === bookId);

      if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
      } else {
        const updatedBook = { ...books[bookIndex], ...req.body };
        books[bookIndex] = updatedBook;

        fs.writeFileSync(path.join(__dirname, '../data/books.json'), JSON.stringify(books, null, 2));
        return res.status(200).json(updatedBook);
      }
    } else {
      res.status(400).json({ error: 'Book ID is required for update' });
    }
  });

export default router;

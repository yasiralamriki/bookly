import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router
	.route('/books')
	.get((req, res) => {
    const booksPath = path.join(__dirname, '../data/books.json');
    const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

    if (req.query.id) {
      return res.status(200).json(books.find(book => book.id === parseInt(req.query.id, 10)));
    } else {
      return res.status(200).json(books);
    }
	})
	.post((req, res) => {
    const booksPath = path.join(__dirname, '../data/books.json');
    const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

    // Create a new book
		const newBook = {
      id: books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1,
      title: req.body.title,
      author: req.body.author
    };

    // Add the new book to the books array and save it
		books.push(newBook);
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));

    // Respond with the newly created book
		res.status(201).json(newBook);
	});

router
  .route('/books/:id')
  .delete((req, res) => {
    const booksPath = path.join(__dirname, '../data/books.json');
    const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
    
    const bookId = parseInt(req.params.id, 10);
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Remove the book from the array
    const deletedBook = books.splice(bookIndex, 1)[0];
    
    // Save the updated books array
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
    
    // Respond with the deleted book
    res.status(200).json(deletedBook);
  });

export default router;

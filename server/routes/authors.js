// Import necessary modules
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Import local modules
import { Author } from '../lib/authors.js';
import { getConfigFile } from '../lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router
	.route('/authors')
	.get((req, res) => {
    const authors = getConfigFile(path.join(__dirname, '../data/authors.json'));

    if (req.query.id) {
      const author = authors.find(author => author.id === parseInt(req.query.id, 10));
      if (author) {
        return res.status(200).json(author);
      } else {
        return res.status(404).json({ error: 'Author not found' });
      }
    } else {
      if(req.query.name) {
        const author = authors.find(author => author.name.toLowerCase() === req.query.name.toString().toLowerCase());
        if (author) {
          return res.status(200).json(author);
        } else {
          return res.status(404).json({ error: 'Author not found' });
        }
      } else {
        return res.status(200).json(authors);
      }
    }
	})
	.post((req, res) => {
    const authors = getConfigFile(path.join(__dirname, '../data/authors.json'));

    // Find the highest existing ID and increment it
    const maxId = authors.length > 0 ? Math.max(...authors.map(author => author.id)) : 0;
    const newAuthor = new Author(
      maxId + 1,
      req.body.name,
      req.body.deathDate || null,
      req.body.notes || []
    );

    authors.push(newAuthor);
    fs.writeFileSync(path.join(__dirname, '../data/authors.json'), JSON.stringify(authors, null, 2));

    res.status(201).json(newAuthor);
	})
  .delete((req, res) => {
    if (req.query.id) {
      const authors = getConfigFile(path.join(__dirname, '../data/authors.json'));
      const authorId = parseInt(req.query.id, 10);
      const authorIndex = authors.findIndex(author => author.id === authorId);

      if (authorIndex === -1) {
        return res.status(404).json({ error: 'Author not found' });
      } else {
        const deletedAuthor = authors.splice(authorIndex, 1)[0];

        fs.writeFileSync(path.join(__dirname, '../data/authors.json'), JSON.stringify(authors, null, 2));
        return res.status(200).json(deletedAuthor);
      }
    } else {
      res.status(400).json({ error: 'Author ID is required for deletion' });
    }
  })
  .put((req, res) => {
    if (req.query.id) {
      const authors = getConfigFile(path.join(__dirname, '../data/authors.json'));
      const authorId = parseInt(req.query.id, 10);
      const authorIndex = authors.findIndex(author => author.id === authorId);

      if (authorIndex === -1) {
        return res.status(404).json({ error: 'Author not found' });
      } else {
        const updatedAuthor = { ...authors[authorIndex], ...req.body };
        authors[authorIndex] = updatedAuthor;

        fs.writeFileSync(path.join(__dirname, '../data/authors.json'), JSON.stringify(authors, null, 2));
        return res.status(200).json(updatedAuthor);
      }
    } else {
      res.status(400).json({ error: 'Author ID is required for update' });
    }
  });

export default router;

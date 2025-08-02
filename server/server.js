import express from 'express';
import ViteExpress from 'vite-express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import booksRouter from './routes/books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Use routes from the server
app.use('/api', booksRouter);

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// ViteExpress configuration
ViteExpress.config({
	mode: isProduction ? 'production' : 'development',
	viteConfigFile: resolve(__dirname, '../client/vite.config.ts'),
	inlineViteConfig: {
		root: resolve(__dirname, '../client'),
		build: {
			outDir: resolve(__dirname, '../client/dist'),
		},
	},
});

ViteExpress.listen(app, 5173, () => {
	console.log(`Server is listening on http://localhost:5173`);
	console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
});

# Bookly

> [!WARNING]
> **Work in Progress**: This project is currently under development. Not all features may be fully implemented or working as expected.

Bookly is a modern web application for managing and browsing your book collection. Built with React, Vite, and TypeScript, it features a clean UI, sorting, searching, and book management capabilities.

![Bookly Screenshot](./public/bookly-screenshot.png)

## Features

- Browse your book collection in a beautiful card layout
- Search for books by title or author
- Sort books in ascending or descending order
- Add and delete books
- Responsive and modern UI

## Getting Started

### Prerequisites
- Node.js (v16 or newer recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Salafi-Coders/bookly.git
   cd bookly
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/components/` — UI components
- `src/data/books.json` — Sample book data
- `public/` — Static assets (add your screenshot here as `bookly-screenshot.png`)

## Customization
- To update the book list, edit `src/data/books.json`.
- UI components can be customized in `src/components/ui/`.

## License

MIT

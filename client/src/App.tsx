import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/themeprovider"
import { Navbar } from "@/components/navbar/navbar"
import Books from "@/pages/books/Books"
import Settings from "@/pages/settings/Settings"
import Authors from '@/pages/authors/Authors'
import Data from '@/pages/data/Data'
import BookPage from "@/pages/book/BookPage"
import { DirectionProvider } from '@radix-ui/react-direction'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

function App() {
  const { i18n } = useTranslation()
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr")

  useEffect(() => {
    const isArabic = i18n.language === 'ar'
    const newDirection = isArabic ? 'rtl' : 'ltr'
    setDirection(newDirection)
    
    // Also update document direction for compatibility
    document.documentElement.dir = newDirection
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <>
      <DirectionProvider dir={direction}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Navbar />
          <Routes>
            <Route path="/" element={<Books />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/data" element={<Data />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="books/:bookId" element={<BookPage />} />
          </Routes>
        </ThemeProvider>
      </DirectionProvider>
    </>
  )
}

export default App

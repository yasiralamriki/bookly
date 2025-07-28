import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Main } from "@/components/main"
import Settings from "@/pages/settings/Settings"
import Authors from './pages/authors/Authors'
import Data from './pages/data/Data'

function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/data" element={<Data />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App

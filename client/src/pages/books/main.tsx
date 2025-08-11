import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import Books from './Books'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Books />
  </StrictMode>,
)

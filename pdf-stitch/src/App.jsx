import { useState, useEffect } from 'react'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    // Handle hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home'
      setCurrentPage(hash)
    }

    // Set initial page
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (page) => {
    window.location.hash = page
    setCurrentPage(page)
  }

  // Expose navigate function globally for Header component
  window.navigateToPage = navigate

  switch (currentPage) {
    case 'how-it-works':
      return <HowItWorks />
    case 'home':
    default:
      return <Home />
  }
}

export default App

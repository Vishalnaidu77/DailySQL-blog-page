import { useState, useEffect } from 'react'
import './App.css'
import dataset from './assets/questions.json'
import Sidebar from './components/Sidebar'
import ProblemCard from './components/ProblemCard'
import MobileMenuToggle from './components/MobileMenuToggle'

const App = () => {
  const { title, tags, total_problems: totalProblems, problems } = dataset
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <div className="app-container">
      <MobileMenuToggle isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
      
      <header className="page-header">
        <div className="badge">Practice SQL Daily</div>
        <h1>{title}</h1>
        <p className="subtitle">
          {totalProblems} real-world SQL problems. No grinding, no overload. Just consistent practice.
        </p>
        <div className="tag-list">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="content-layout">
        <Sidebar 
          problems={problems} 
          isMobileOpen={isMobileMenuOpen}
          onLinkClick={closeMobileMenu}
          onClose={closeMobileMenu}
        />
        
        <main className="main-content">
          <section className="problem-list">
            {problems.map((problem) => (
              <ProblemCard key={problem.section_id} problem={problem} />
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
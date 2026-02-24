const MobileMenuToggle = ({ isOpen, onClick }) => {
  return (
    <>
      <button 
        className={`mobile-menu-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={onClick}
        aria-label="Open navigation menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClick}
      />
    </>
  )
}

export default MobileMenuToggle

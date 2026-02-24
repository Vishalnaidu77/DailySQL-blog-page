import { useRef } from 'react'
import ZigzagScrollbar from './ZigzagScrollbar'

const Sidebar = ({ problems }) => {
  const scrollRef = useRef(null)

  return (
    <aside className="sidebar">
      <div className="sidebar-wrapper">
        <div className="sidebar-inner" ref={scrollRef}>
          <div className="sidebar-header sticky top-0 bg-[#111414] z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>On this page</span>
          </div>
          <nav className="sidebar-nav">
            {problems.map((problem) => (
              <a
                key={problem.section_id}
                href={`#${problem.section_id}`}
                className="sidebar-link"
              >
                <span className="sidebar-link-id">{problem.id}.</span>
                <span className="sidebar-link-title">{problem.title}</span>
                <span className={`sidebar-link-difficulty ${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </a>
            ))}
          </nav>
        </div>
        <ZigzagScrollbar scrollRef={scrollRef} />
      </div>
    </aside>
  )
}

export default Sidebar

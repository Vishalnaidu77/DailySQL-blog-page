import './App.css'
import dataset from './assets/questions.json'
import Sidebar from './components/Sidebar'
import ProblemCard from './components/ProblemCard'

const App = () => {
  const { title, tags, total_problems: totalProblems, problems } = dataset

  return (
    <div className="app-container">
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
        <Sidebar problems={problems} />
        
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
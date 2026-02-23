import { useState, useMemo } from 'react'
import './App.css'
import dataset from './assets/questions.json'

// SQL Syntax Highlighter
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'AS', 'DISTINCT', 'ALL', 'TOP', 'LIMIT', 'OFFSET', 'ORDER', 'BY', 'ASC', 'DESC',
  'GROUP', 'HAVING', 'UNION', 'INTERSECT', 'EXCEPT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'ALTER', 'DROP',
  'TABLE', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'CONSTRAINT', 'DEFAULT', 'CHECK', 'UNIQUE', 'AUTO_INCREMENT', 'IF', 'BEGIN', 'RETURN',
  'WITH', 'RECURSIVE', 'OVER', 'PARTITION', 'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE',
  'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'SUM', 'COUNT', 'AVG', 'MIN', 'MAX',
  'COALESCE', 'NULLIF', 'CAST', 'CONVERT', 'EXTRACT', 'EPOCH', 'INTERVAL',
  'INT', 'INTEGER', 'VARCHAR', 'CHAR', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP', 'BOOLEAN',
  'DECLARE', 'FUNCTION', 'PROCEDURE', 'RETURNS', 'TRIGGER', 'CURSOR', 'FETCH', 'CLOSE',
]

const highlightSQL = (code) => {
  const tokens = []
  let remaining = code
  let key = 0

  while (remaining.length > 0) {
    // Comments (-- or #)
    const commentMatch = remaining.match(/^(--|#)(.*)$/m)
    if (commentMatch && remaining.startsWith(commentMatch[1])) {
      const fullComment = commentMatch[0]
      tokens.push(<span key={key++} className="sql-comment">{fullComment}</span>)
      remaining = remaining.slice(fullComment.length)
      continue
    }

    // Strings (single quotes)
    if (remaining[0] === "'") {
      const endIdx = remaining.indexOf("'", 1)
      if (endIdx !== -1) {
        const str = remaining.slice(0, endIdx + 1)
        tokens.push(<span key={key++} className="sql-string">{str}</span>)
        remaining = remaining.slice(endIdx + 1)
        continue
      }
    }

    // Numbers
    const numMatch = remaining.match(/^(\d+(\.\d+)?)\b/)
    if (numMatch) {
      tokens.push(<span key={key++} className="sql-number">{numMatch[0]}</span>)
      remaining = remaining.slice(numMatch[0].length)
      continue
    }

    // Keywords and identifiers
    const wordMatch = remaining.match(/^([A-Za-z_][A-Za-z0-9_]*)\b/)
    if (wordMatch) {
      const word = wordMatch[0]
      const upperWord = word.toUpperCase()
      if (SQL_KEYWORDS.includes(upperWord)) {
        tokens.push(<span key={key++} className="sql-keyword">{word}</span>)
      } else {
        tokens.push(<span key={key++} className="sql-identifier">{word}</span>)
      }
      remaining = remaining.slice(word.length)
      continue
    }

    // Operators
    const opMatch = remaining.match(/^([=<>!]=?|[+\-*/%]|<>|\|\||&&)/)
    if (opMatch) {
      tokens.push(<span key={key++} className="sql-operator">{opMatch[0]}</span>)
      remaining = remaining.slice(opMatch[0].length)
      continue
    }

    // Punctuation and whitespace
    tokens.push(<span key={key++} className="sql-punctuation">{remaining[0]}</span>)
    remaining = remaining.slice(1)
  }

  return tokens
}

const SQLCode = ({ code }) => {
  const highlighted = useMemo(() => highlightSQL(code), [code])
  return <code className="sql-code">{highlighted}</code>
}

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button className="copy-btn" onClick={handleCopy} aria-label="Copy code">
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        </svg>
      )}
    </button>
  )
}

const App = () => {
  const { title, source, tags, total_problems: totalProblems, scraped_at: scrapedAt, problems } = dataset

  const difficultyClasses = {
    Easy: 'difficulty easy',
    Medium: 'difficulty medium',
    Hard: 'difficulty hard',
  }

  return (
    <main className="page">
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

      <section className="problem-list">
        {problems.map((problem) => (
          <article key={problem.section_id} className="problem-card" id={problem.section_id}>
            <div className="problem-head">
              <h2>
                {problem.id}. {problem.title}
              </h2>
              <span className={difficultyClasses[problem.difficulty] ?? 'difficulty'}>{problem.difficulty}</span>
            </div>

            {problem.description ? <p className="problem-description">{problem.description}</p> : null}

            {problem.tables.length > 0 ? (
              <p className="problem-tables">
                <strong>Tables:</strong> {problem.tables.join(', ')}
              </p>
            ) : null}

            {problem.leetcode_url ? (
              <p className="problem-link">
                <a href={problem.leetcode_url} target="_blank" rel="noreferrer">
                  Open on LeetCode →
                </a>
              </p>
            ) : null}

            <div className="solution-list">
              {problem.solutions.map((solution) => (
                <section key={`${problem.id}-${solution.label}`} className="solution-block">
                  <div className="solution-header">
                    <h3>{solution.label}</h3>
                    <CopyButton text={solution.sql} />
                  </div>
                  <div className="code-container">
                    <div className="line-numbers">
                      {solution.sql.split('\n').map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>
                    <pre>
                      <SQLCode code={solution.sql} />
                    </pre>
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer className="page-footer">
        <p>Data sourced from dsfaisal.com • Built with React + Vite</p>
      </footer>
    </main>
  )
}

export default App
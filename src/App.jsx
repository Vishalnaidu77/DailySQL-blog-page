import { useState, useMemo } from 'react'
import './App.css'
import dataset from './assets/questions.json'

// Sidebar Navigation Component
const Sidebar = ({ problems }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
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
    </aside>
  )
}

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

// Schema syntax highlighter for table definitions
const highlightSchema = (schema) => {
  const lines = schema.split('\n')
  const tokens = []
  let key = 0

  const SQL_TYPES = ['int', 'varchar', 'char', 'text', 'date', 'datetime', 'timestamp', 'boolean', 'decimal', 'float', 'double', 'bigint', 'smallint', 'tinyint', 'enum']

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) {
      tokens.push(<br key={key++} />)
    }

    // Table border lines
    if (/^[+\-|]+$/.test(line.trim().replace(/\s/g, ''))) {
      tokens.push(<span key={key++} className="schema-border">{line}</span>)
      return
    }

    // Header row or data row with | separators
    if (line.includes('|')) {
      const parts = line.split('|')
      parts.forEach((part, idx) => {
        if (idx > 0) {
          tokens.push(<span key={key++} className="schema-border">|</span>)
        }
        
        const trimmed = part.trim().toLowerCase()
        
        // Check if it's a type
        if (SQL_TYPES.some(t => trimmed === t)) {
          tokens.push(<span key={key++} className="schema-type">{part}</span>)
        }
        // Check if header
        else if (trimmed === 'column name' || trimmed === 'type') {
          tokens.push(<span key={key++} className="schema-header">{part}</span>)
        }
        // Column name
        else if (part.trim() && !/^[-+]+$/.test(part.trim())) {
          tokens.push(<span key={key++} className="schema-column">{part}</span>)
        }
        else {
          tokens.push(<span key={key++}>{part}</span>)
        }
      })
      return
    }

    // Primary key note or other text
    if (line.trim()) {
      tokens.push(<span key={key++} className="schema-note">{line}</span>)
    }
  })

  return tokens
}

const SchemaCode = ({ schema }) => {
  const highlighted = useMemo(() => highlightSchema(schema), [schema])
  return <code className="schema-code">{highlighted}</code>
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
              <article key={problem.section_id} className="problem-card" id={problem.section_id}>
                {/* Problem Title Header */}
                <h2 className="problem-title">
                  {problem.id}. {problem.title} | <span className={`difficulty-inline ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span> |{' '}
                  {problem.leetcode_url ? (
                    <a href={problem.leetcode_url} target="_blank" rel="noreferrer">
                      LeetCode
                    </a>
                  ) : (
                    'LeetCode'
                  )}
                </h2>

                {/* Table Schema Sections */}
                {problem.table_schemas && problem.table_schemas.length > 0 && (
                  <div className="tables-section">
                    {problem.table_schemas.map((table) => (
                      <div key={table.name} className="table-schema-block">
                        <p className="table-label">
                          Table: <code>{table.name}</code>
                        </p>
                        <div className="code-block schema-block">
                          <div className="code-block-header">
                            <CopyButton text={table.schema} />
                          </div>
                          <pre className="schema-pre">
                            <SchemaCode schema={table.schema} />
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Problem Description */}
                {problem.description && (
                  <div className="description-section">
                    <p className="problem-description">{problem.description}</p>
                  </div>
                )}

                {/* Solution Section */}
                <div className="solution-section">
                  <h3 className="section-title">Solution</h3>
                  {problem.solutions.map((solution) => (
                    <div key={`${problem.id}-${solution.label}`} className="code-block">
                      <div className="code-block-header">
                        {problem.solutions.length > 1 && <span className="solution-label">{solution.label}</span>}
                        <CopyButton text={solution.sql} />
                      </div>
                      <pre>
                        <SQLCode code={solution.sql} />
                      </pre>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
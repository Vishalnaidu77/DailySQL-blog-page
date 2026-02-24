export const SQL_KEYWORDS = [
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

export const highlightSQL = (code) => {
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

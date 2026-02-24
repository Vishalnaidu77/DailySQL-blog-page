const SQL_TYPES = ['int', 'varchar', 'char', 'text', 'date', 'datetime', 'timestamp', 'boolean', 'decimal', 'float', 'double', 'bigint', 'smallint', 'tinyint', 'enum']

export const highlightSchema = (schema) => {
  const lines = schema.split('\n')
  const tokens = []
  let key = 0

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

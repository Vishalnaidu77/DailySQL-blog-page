import { useMemo } from 'react'
import { highlightSQL } from '../utils/sqlHighlighter'

const SQLCode = ({ code }) => {
  const highlighted = useMemo(() => highlightSQL(code), [code])
  return <code className="sql-code">{highlighted}</code>
}

export default SQLCode

import { useMemo } from 'react'
import { highlightSchema } from '../utils/schemaHighlighter'

const SchemaCode = ({ schema }) => {
  const highlighted = useMemo(() => highlightSchema(schema), [schema])
  return <code className="schema-code">{highlighted}</code>
}

export default SchemaCode

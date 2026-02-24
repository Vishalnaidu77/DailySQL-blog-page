import CopyButton from './CopyButton'
import SQLCode from './SQLCode'
import SchemaCode from './SchemaCode'

const ProblemCard = ({ problem }) => {
  return (
    <article className="problem-card" id={problem.section_id}>
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
  )
}

export default ProblemCard

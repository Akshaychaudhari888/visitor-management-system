/**
 * Shared visitor data table. Renders columns and rows based on a column
 * config, eliminating repeated <table> + <thead> + <tbody> markup across
 * VisitorDetails, ManagerVisitorList, VisitorOutForm, and ManagerVisitorForm.
 *
 * columns: [{ key: string, header: string, render?: (value, row) => node }]
 * data: array of visitor objects
 * emptyMessage: string shown when data is empty (optional)
 */
function VisitorTable({ columns, data, emptyMessage }) {
  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && emptyMessage && (
        <p className="no-data">{emptyMessage}</p>
      )}
    </>
  );
}

export default VisitorTable;

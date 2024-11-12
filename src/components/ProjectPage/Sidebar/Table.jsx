import Row from './Row';

const Table = ({ source }) => {
  return (
    <table className="table-container">
      <thead>
        <tr className="table-header">
          {source.columnAliases.map((alias, index) => (
            <th key={index} className="table-field">
              {alias}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {source.data.map((rowData, index) => (
          <Row key={index} rowData={rowData} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;

import Row from './Row';

const Table = ({ source }) => {
  if (source.source === 'monitorDevice') console.log(source.toDisplayData);
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
        {source.source === 'monitorDevice'
          ? source.toDisplayData.map((rowData, index) => (
              <Row key={index} rowData={rowData} needChart={true} />
            ))
          : source.toDisplayData.map((rowData, index) => (
              <Row key={index} rowData={rowData} />
            ))}
      </tbody>
    </table>
  );
};

export default Table;

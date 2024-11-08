import Row from './Row';

import './Sidebar.css';

const Table = ({ source }) => {
  return (
    <table className="table-container">
      <caption className="table-title">{source.title}</caption>
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

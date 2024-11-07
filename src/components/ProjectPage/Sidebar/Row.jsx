import './Sidebar.css';

const Row = ({ rowData }) => {
  return (
    <div className="row-container">
      {Object.entries(rowData).map(([key, value]) => {
        if (key === 'imageSource') {
          return (
            <p key={key} className="entity">
              <img className="icon-image" key={key} src={value} alt="" />
            </p>
          );
        } else {
          return (
            <p key={key} className="entity">
              {value}
            </p>
          );
        }
      })}
    </div>
  );
};

export default Row;

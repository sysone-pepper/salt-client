import React from 'react';

const iconTypes = { red: '#dd2c31', green: '#3f7ec8', blue: '#7cbc35' };

export const CustomIconNode = ({ node, data }) => {
  return (
    <>
      <div style={{ width: node?.width(), height: node?.height() }}>
        <i
          className="bi bi-geo-alt-fill"
          style={{
            color: iconTypes[data?.iconType],
            fontSize: `50px`,
          }}
        ></i>
      </div>
    </>
  );
};

import React from 'react';
import './CustomIconNode.css';

const iconTypes = { red: '#dd2c31', green: '#3f7ec8', blue: '#7cbc35' };

export const CustomIconNode = ({ node, data }) => {
  return (
    <>
      <div
        className="icon-container"
        style={{
          width: node?.width(),
          height: node?.height(),
        }}
      >
        <i
          className="bi bi-geo-alt-fill"
          style={{
            color: iconTypes[data?.iconType],
          }}
        ></i>
      </div>
    </>
  );
};

import React from 'react';

export const CustomIconNode = ({ node, data }) => {
  return (
    <>
      <div style={{ width: node?.width(), height: node?.height() }}>
        <i
          className="bi bi-geo-alt-fill"
          style={{
            color: data?.iconType,
            fontSize: `50px`,
          }}
        ></i>
      </div>
    </>
  );
};

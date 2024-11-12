import React from 'react';
import './CustomTextNode.css';

export const CustomTextNode = ({ node, data }) => {
  return (
    <div className="text-field" style={{ color: data.textColor }}>
      {data.textContent}
    </div>
  );
};

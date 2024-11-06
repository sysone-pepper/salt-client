import React from 'react';

const CustomInput = ({ value, onChange, ...props }) => {
  const handleFocus = () => {
    if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <input
      {...props}
      value={value}
      onFocus={handleFocus}
      onChange={onChange}
      autoComplete="off"
    />
  );
};

export default CustomInput;

import './IconInput.css';
import { CustomIconNode } from '../CustomIconNode';
import { useRef } from 'react';

export const IconInput = ({ iconType, setIconType }) => {
  const colorInputRef = useRef(null);

  const handleColorChange = (e) => {
    setIconType(e.target.value);
  };

  const handleIconClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.showPicker(); // Trigger click on hidden input
    }
  };
  return (
    <>
      <div className="form-group">
        <label htmlFor="icon-types">
          <p>색상</p>
          <p style={{ fontSize: '.6rem' }}>
            *아이콘을 클릭해서 색상을 선택해보세요
          </p>
        </label>
        <div className="icon-types node-modal-content" id="icon-types">
          <CustomIconNode
            id="icon-preview"
            data={{ nodeSize: '50%', iconType }}
            onClick={handleIconClick}
          ></CustomIconNode>
          <input
            id="icon-color-input"
            type="color"
            value={iconType}
            onChange={handleColorChange}
            style={{ visibility: 'hidden' }}
            ref={colorInputRef}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">적용</button>
      </div>
    </>
  );
};

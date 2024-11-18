import { useContext, useRef } from 'react';
import './TextInput.css';
import { NetworkContext } from '../../../contexts/NetworkContext';

export const TextInput = ({
  textContent,
  setTextContent,
  textColor,
  setTextColor,
}) => {
  const { selectedSize } = useContext(NetworkContext);

  const colorInputRef = useRef();

  const handleTextContentChange = (e) => {
    setTextContent(e.target.value);
  };
  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };
  const handleColorInputClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.showPicker(); // Trigger click on hidden input
    }
  };
  return (
    <>
      <div className="form-group">
        <label htmlFor="text-content">텍스트 내용 및 색상</label>
        <div className="text-content node-modal-content" id="text-content">
          <input
            id="text-content-input"
            type="text"
            value={textContent}
            onChange={handleTextContentChange}
            placeholder="여기에 텍스트를 입력하세요"
          />
          <div className="color-indicator-wrapper">
            <div
              className="color-indicator"
              onClick={handleColorInputClick}
              style={{ backgroundColor: textColor }}
            />
          </div>
          <input
            id="text-color-input"
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            style={{ visibility: 'hidden' }}
            ref={colorInputRef}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="text-preview">텍스트 미리보기</label>
        <div
          className="text-preview node-modal-content"
          id="text-preview"
          style={{ color: textColor, fontSize: selectedSize }}
        >
          {textContent}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">적용</button>
      </div>
    </>
  );
};

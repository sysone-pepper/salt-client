import { useContext } from 'react';
import './TextInput.css';
import { NetworkContext } from '../../../contexts/NetworkContext';

export const TextInput = ({
  textContent,
  setTextContent,
  textColor,
  setTextColor,
}) => {
  const { selectedSize } = useContext(NetworkContext);
  const handleTextContentChange = (e) => {
    setTextContent(e.target.value);
  };
  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };
  return (
    <>
      <div className="form-group">
        <label htmlFor="text-content">텍스트 내용</label>
        <div className="text-content" id="text-content">
          <input
            id="text-content-input"
            type="text"
            value={textContent}
            onChange={handleTextContentChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="text-color">텍스트 색상</label>
        <div className="text-color" id="text-color">
          <input
            id="text-color-input"
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="text-preview">텍스트 미리보기</label>
        <div
          className="text-preview"
          id="text-preview"
          style={{ color: textColor, fontSize: selectedSize }}
        >
          {textContent}
        </div>
      </div>
      <button type="submit">적용</button>
    </>
  );
};

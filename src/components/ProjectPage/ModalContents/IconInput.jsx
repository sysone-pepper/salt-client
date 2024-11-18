import './IconInput.css';
import { CustomIconNode } from '../CustomIconNode';

export const IconInput = ({ iconType, setIconType }) => {
  const handleColorChange = (e) => {
    setIconType(e.target.value);
  };
  return (
    <>
      <div className="form-group">
        <label htmlFor="icon-types">색상</label>
        <div className="icon-types node-modal-content" id="icon-types">
          <CustomIconNode
            id="icon-preview"
            data={{ nodeSize: '50%', iconType }}
          ></CustomIconNode>
          <input
            id="icon-color-input"
            type="color"
            value={iconType}
            onChange={handleColorChange}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">적용</button>
      </div>
    </>
  );
};

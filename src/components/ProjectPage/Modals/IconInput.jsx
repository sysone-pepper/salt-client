const iconTypes = { red: '#dd2c31', green: '#3f7ec8', blue: '#7cbc35' };
import 'bootstrap-icons/font/bootstrap-icons.css';
import './IconInput.css';

export const IconInput = ({ setIconType }) => {
  return (
    <div className="form-group">
      <label htmlFor="icon-types">유형</label>
      <div className="icon-types" id="icon-types">
        {Object.entries(iconTypes).map(([key, value], idx) => {
          console.log(`${key}, ${value}], ${idx}`);
          return (
            <label
              htmlFor={`icon-type-${key}`}
              key={key}
              className="icon-type-label"
              onClick={() => {
                setIconType(key);
              }}
              required={idx === 0}
            >
              <div className="icon-radio">
                <input
                  type="radio"
                  name="icon-type"
                  value={key}
                  id={`icon-type-${key}`}
                />
                <i className="bi bi-geo-alt-fill" style={{ color: value }}></i>
              </div>
            </label>
          );
        })}
      </div>
      <div className="form-actions">
        <button type="submit">적용</button>
      </div>
    </div>
  );
};

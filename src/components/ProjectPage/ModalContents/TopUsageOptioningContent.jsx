import React, { useState } from 'react';
import { MonitoringOptions } from '../../../constants/MonitoringOptions';

export const TopUsageOptioningContent = ({
  topUsageOption,
  setTopUsageOption,
  closeModal,
}) => {
  const [selectedOption, setSelectedOption] = useState(topUsageOption);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTopUsageOption(selectedOption);
    closeModal();
  };

  return (
    <form className="form-in-sidebar" onSubmit={handleSubmit}>
      <h3 className="monitoring-option-title">Top5 모니터링 옵션</h3>
      <div className="optioning form-group">
        <select
          id="top-usage-option-select"
          onChange={(event) => {
            setSelectedOption(event.target.value);
          }}
          defaultValue={topUsageOption}
        >
          {Object.keys(MonitoringOptions).map((item, idx) => {
            return (
              <option value={item} key={idx}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit">확인</button>
      </div>
    </form>
  );
};

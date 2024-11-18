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
    <form onSubmit={handleSubmit}>
      <h3>Top5 모니터링 옵션</h3>
      <select
        id="top-usage-option-select"
        onChange={(event) => {
          setSelectedOption(event.target.value);
        }}
      >
        {Object.keys(MonitoringOptions).map((item) => {
          if (item === selectedOption) {
            return (
              <option value={item} selected>
                {item}
              </option>
            );
          } else {
            return <option value={item}>{item}</option>;
          }
        })}
      </select>
      <button type="submit">확인</button>
    </form>
  );
};

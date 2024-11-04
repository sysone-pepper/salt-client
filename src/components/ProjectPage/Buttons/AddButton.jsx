import React, { Children } from 'react';
import './Buttons.css';
import AddIcon from '../../../assets/images/add-icon.png';
import ObjectIcon from '../../../assets/images/object-icon2.png';
import LinkIcon from '../../../assets/images/link-icon2.png';
import group from '../../../assets/images/group.png';
import ungroup from '../../../assets/images/ungroup.png';
import navigatorIcon from '../../../assets/images/navigator-icon.png';

const images = {
  'add-icon.png': AddIcon,
  'object-icon.png': ObjectIcon,
  'link-icon.png': LinkIcon,
  'group.png': group,
  'ungroup.png': ungroup,
  'navigator-icon.png': navigatorIcon,
};

export const AddButton = ({
  children,
  fileName,
  onClickEvent,
  needCancel,
  disabled,
}) => {
  const handleClick = (e) => {
    if (!disabled) {
      onClickEvent(e);
    }
  };

  return (
    <div className="add-button">
      <div
        className={`add-button-wrapper ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
      >
        <div
          className={`add-button-content-container ${
            needCancel ? 'cancel' : ''
          }`}
        >
          <img
            src={images[fileName]}
            alt="오브젝트 추가"
            className="add-button-content"
          />
        </div>
        <div
          className={`add-button-symbol-container ${
            needCancel ? 'cancel' : ''
          }`}
        >
          <img
            src={AddIcon}
            alt="더하기 기호"
            className={`add-button-symbol ${needCancel ? 'rotate' : ''}`}
          />
        </div>
      </div>
      <div className="hidden-text">{children}</div>
    </div>
  );
};

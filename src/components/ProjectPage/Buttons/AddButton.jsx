import React from "react";
import "./Buttons.css";
import AddIcon from "../../../assets/images/add-icon.png";
import ObjectIcon from "../../../assets/images/object-icon2.png";
import LinkIcon from "../../../assets/images/link-icon2.png";

const images = {
  "add-icon.png": AddIcon,
  "object-icon.png": ObjectIcon,
  "link-icon.png": LinkIcon,
};

export const AddButton = ({ fileName, onClickEvent }) => {
  return (
    <div className="add-button-wrapper" onClick={onClickEvent}>
      <div className="add-button-content-container">
        <img
          src={images[fileName]}
          alt="오브젝트 추가"
          className="add-button-content"
        />
      </div>
      <div className="add-button-symbol-container">
        <img src={AddIcon} alt="더하기 기호" className="add-button-symbol" />
      </div>
    </div>
  );
};

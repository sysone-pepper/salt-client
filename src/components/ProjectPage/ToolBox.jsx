import React, { useContext, useRef } from "react";
import { AddButton } from "./Buttons/AddButton";
import "./ToolBox.css";
import { NetworkContext } from "../../contexts/NetworkContext";

export const ToolBox = () => {
  const { isLinking, setIsLinking, setIsModalOpen, setCurModalType } =
    useContext(NetworkContext);
  const toggleAddNode = () => {
    setIsModalOpen(true);
    setCurModalType("create");
  };
  const activeAddLink = () => {
    setIsLinking(true);
  };
  const inactiveAddLink = () => {
    setIsLinking(false);
  };
  return (
    <div className="tool-box-container">
      <AddButton fileName={"object-icon.png"} onClickEvent={toggleAddNode} />
      {isLinking ? (
        <AddButton
          fileName={"link-icon.png"}
          onClickEvent={inactiveAddLink}
          needCancel={true}
        />
      ) : (
        <AddButton fileName={"link-icon.png"} onClickEvent={activeAddLink} />
      )}
    </div>
  );
};

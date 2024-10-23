import React, { useContext } from "react";
import { AddButton } from "./Buttons/AddButton";
import "./ToolBox.css";
import { NetworkContext } from "../../contexts/NetworkContext";

export const ToolBox = () => {
  const { setIsModalOpen, setCurModalType } = useContext(NetworkContext);
  const toggleAddNode = () => {
    setIsModalOpen(true);
    setCurModalType("create");
  };
  const toggleAddLink = () => {
    console.log("link");
  };
  return (
    <div className="tool-box-container">
      <AddButton fileName={"object-icon.png"} onClickEvent={toggleAddNode} />
      <AddButton fileName={"link-icon.png"} onClickEvent={toggleAddLink} />
    </div>
  );
};

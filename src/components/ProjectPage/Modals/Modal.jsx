import React, { useContext, useState } from "react";
import { NetworkContext } from "../../../contexts/NetworkContext";
import "./Modal.css";
import { CreateNodeContent } from "./CreateNodeContent";

const modalType = {
  create: <CreateNodeContent />,
  update: <>update</>,
};

export const Modal = () => {
  const { setIsModalOpen, curModalType, setCurModalType } =
    useContext(NetworkContext);
  return (
    <div className="modal-presentation">
      <div
        className="modal-wrapper"
        onClick={(e) => {
          if (e.target.classList.contains("modal-wrapper")) {
            setIsModalOpen(false);
            setCurModalType("");
          }
        }}
      >
        <div className="modal-container">
          <button
            className="modal-close-button"
            onClick={() => setIsModalOpen(false)}
          >
            X
          </button>
          <div className="modal-content">{modalType[curModalType]}</div>
        </div>
      </div>
    </div>
  );
};

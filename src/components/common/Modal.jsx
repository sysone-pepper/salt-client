import React from 'react';
import './Modal.css';

export const Modal = ({ child, closeModal, className }) => {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) {
          closeModal();
        }
      }}
    >
      <div className={`modal-content ${className || ''}`}>
        <button className="modal-close-button" onClick={closeModal}>
          &times;
        </button>
        {child}
      </div>
    </div>
  );
};

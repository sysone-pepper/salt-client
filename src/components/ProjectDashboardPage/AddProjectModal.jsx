import React, { useState } from "react";
import "./AddProjectModal.css";

const AddProjectModal = ({ closeModal, onCreate }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleCreate = () => {
    onCreate(projectName, projectDescription);
    // closeModal();
  };

  return (
    <div className="ap-modal-overlay">
      <div className="ap-modal-content">
        <div className="ap-wrapper">
          <form
            className="ap-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <h1 className="ap-title">새 프로젝트 생성</h1>
            <hr className="ap-sep" />
            <div className="ap-group">
              <input
                type="text"
                required
                className="ap-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <span className="ap-highlight"></span>
              <span className="ap-bar"></span>
              <label className="ap-label">프로젝트 명</label>
            </div>
            <div className="ap-group">
              <textarea
                rows="5"
                required
                className="ap-textarea"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              ></textarea>
              <span className="ap-highlight"></span>
              <span className="ap-bar"></span>
              <label className="ap-label">프로젝트 설명</label>
            </div>
            <div className="ap-btn-box">
              <button className="ap-btn ap-btn-submit" type="submit">
                생성
              </button>
              <button
                className="ap-btn ap-btn-cancel"
                type="button"
                onClick={closeModal}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;

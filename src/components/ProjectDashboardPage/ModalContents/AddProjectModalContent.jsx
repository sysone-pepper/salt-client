import React, { useState } from 'react';
import './AddProjectModalContent.css';

const AddProjectModalContent = ({ closeModal, onCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleCreate = () => {
    onCreate(projectName, projectDescription);
  };

  return (
    <>
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
    </>
  );
};

export default AddProjectModalContent;

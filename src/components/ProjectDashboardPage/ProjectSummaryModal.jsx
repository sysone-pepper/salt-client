import React from "react";
import "./ProjectSummaryModal.css";

const ProjectSummaryModal = ({ project, closeModal }) => {
  if (!project) return null;

  return (
    <div className="psm-overlay">
      <div className="psm-content">
        <button className="psm-close-button" onClick={closeModal}>
          &times;
        </button>
        <h2 className="psm-title">{project.projectName}</h2>
        <div className="psm-info-grid">
          <div className="psm-info-item">
            <span className="psm-label">프로젝트 설명</span>
            <p className="psm-value">{project.description}</p>
          </div>
          <div className="psm-info-item">
            <span className="psm-label">작성자</span>
            <p className="psm-value">{project.author}</p>
          </div>
          <div className="psm-info-item">
            <span className="psm-label">마지막 수정자</span>
            <p className="psm-value">{project.lastEditor}</p>
          </div>
          <div className="psm-info-item">
            <span className="psm-label">프로젝트 생성일</span>
            <p className="psm-value">{project.creationDate}</p>
          </div>
          <div className="psm-info-item">
            <span className="psm-label">프로젝트 마지막 수정일</span>
            <p className="psm-value">{project.lastModifiedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryModal;

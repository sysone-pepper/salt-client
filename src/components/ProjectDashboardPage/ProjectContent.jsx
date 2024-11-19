import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectContent.css';
import deleteIcon from '../../assets/images/delete.png';

const ProjectContent = ({
  id,
  imageSrc,
  projectName,
  author,
  description,
  deleteProject,
  onShowSummary,
}) => {
  return (
    <figure className="project-content">
      <button
        className="delete-button"
        onClick={() => deleteProject(id)}
        title="프로젝트 삭제"
      >
        <img src={deleteIcon} alt="삭제 아이콘" className="delete-icon" />
      </button>
      <div className="image-container">
        <img src={imageSrc} alt={projectName} />
      </div>
      <figcaption>
        <h2>
          {projectName}
          <span>@{author}</span>
        </h2>
        {/* <p>{description}</p> */}
        <Link to={`/project/${id}`} className="follow">
          구성도 조회
        </Link>
        <a
          href="#"
          className="info"
          onClick={(e) => {
            e.preventDefault();
            onShowSummary();
          }}
        >
          구성도 요약
        </a>
      </figcaption>
    </figure>
  );
};

export default ProjectContent;

import React, { useContext } from 'react';
import { NetworkContext } from '../contexts/NetworkContext';
import './ProjectPage.css';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/ProjectPage/Sidebar/Sidebar';
import { DiagramField } from '../components/ProjectPage/DiagramField';
import Header from '../layout/Header';
import Toolbar from '../components/ProjectPage/Toolbar';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { isEditing } = useContext(NetworkContext);

  return (
    <>
      <Header />
      <Toolbar />
      <div className="flex-div">
        {!isEditing && <Sidebar />}
        <DiagramField projectId={Number(projectId)} />
      </div>
    </>
  );
};

export default ProjectPage;

import React from 'react';
import { NetworkProvider } from '../contexts/NetworkContext';
import './ProjectPage.css';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/ProjectPage/Sidebar/Sidebar';
import { DiagramField } from '../components/ProjectPage/DiagramField';
import Header from '../layout/Header';
import Toolbar from '../components/ProjectPage/Toolbar';

const ProjectPage = () => {
  const { projectId } = useParams();
  return (
    <NetworkProvider>
      <Header />
      <Toolbar />
      <div className="flex-div">
        <Sidebar />
        <DiagramField projectId={Number(projectId)} />
      </div>
    </NetworkProvider>
  );
};

export default ProjectPage;

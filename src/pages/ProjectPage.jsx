import React from 'react';
import { NetworkMap } from '../components/ProjectPage/NetworkMap';
import { NetworkProvider } from '../contexts/NetworkContext';
import './ProjectPage.css';
const ProjectPage = () => {
  return (
    <>
      <div>ProjectPage</div>
      <NetworkProvider>
        <NetworkMap />
      </NetworkProvider>
    </>
  );
};

export default ProjectPage;

import React, { useContext, useEffect } from 'react';
import { NetworkMap } from '../components/ProjectPage/NetworkMap';
import { NetworkContext, NetworkProvider } from '../contexts/NetworkContext';
import './ProjectPage.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/ProjectPage/Sidebar/Sidebar';
import { DiagramField } from '../components/ProjectPage/DiagramField';
import Header from '../layout/Header';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      alert('올바르지 않은 접근입니다. 다시 로그인해주세요.');
      navigate('/');
      return;
    }
  }, []);
  return (
    <>
      <NetworkProvider>
        <Header />
        <DiagramField projectId={Number(projectId)} />
      </NetworkProvider>
    </>
  );
};

export default ProjectPage;

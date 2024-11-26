import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/images/default_Image.webp';
import Header from '../layout/Header';
import UserContent from '../components/ProjectDashboardPage/UserContent';
import { Modal } from '../components/common/Modal';
import AddUserModalContent from '../components/ProjectDashboardPage/ModalContents/AddUserModalContent';
import ViewAllUsersModalContent from '../components/ProjectDashboardPage/ModalContents/ViewAllUsersModalContent';
import ProjectContent from '../components/ProjectDashboardPage/ProjectContent';
import AddProjectModalContent from '../components/ProjectDashboardPage/ModalContents/AddProjectModalContent';
import ProjectSummaryModalContent from '../components/ProjectDashboardPage/ModalContents/ProjectSummaryModalContent';
import FooterDark from '../layout/Footer';
import './ProjectDashboard.css';
import { useAuth } from '../contexts/AuthContext';
import * as userApi from '../api/User';
import * as projectApi from '../api/Projects';

const ProjectList = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [projectsData, setProjectsData] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProjectSummaryModal, setShowProjectSummaryModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [usersData, setUsersData] = useState([
    {
      id: 'view-all',
      name: '전체보기',
      isViewAll: true,
    },
  ]);

  const fetchUsers = async () => {
    try {
      const res = await userApi.getUsers();
      if (res.success) {
        const { users } = res.data;
        const formattedUsers = users.map((user) => ({
          id: user.id,
          username: user.id,
          name: user.name,
          authority: user.authority,
          role: user.role,
        }));

        const newUsersData = [...usersData, ...formattedUsers];
        setUsersData(newUsersData);
      }
    } catch (e) {
      alert('사용자 목록을 가져오는데 실패했습니다.');
    }
  };

  const getValidImageUrl = (tnImgUrl) => {
    return tnImgUrl && tnImgUrl.trim() !== '' ? tnImgUrl : defaultImage;
  };

  const fetchProjects = async () => {
    try {
      const data = await projectApi.getProjects();

      if (data.success) {
        const formattedProjects = data.data.map((project) => ({
          id: project.id,
          imageSrc: getValidImageUrl(project.tnImgUrl),
          projectName: project.title,
          author: project.username,
          description: project.summary,
        }));

        setProjectsData(formattedProjects);
      }
    } catch (e) {
      alert('프로젝트 데이터를 가져오는데 실패했습니다.');
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await userApi.addUserAPI(userData);
      if (response.success) {
        const newUser = {
          id: userData.id,
          username: userData.id,
          name: userData.name,
          authority: userData.authority,
        };
        setUsersData((prev) => [...prev, newUser]);
        setShowAddUserModal(false);
      }
    } catch (error) {
      alert('사용자 생성에 실패했습니다.');
    }
  };

  const deleteUser = async (username) => {
    try {
      await userApi.deleteUserAPI(username);
      setUsersData((prevUsers) =>
        prevUsers.filter((user) => user.username !== username),
      );
    } catch (error) {
      alert('사용자 삭제에 실패했습니다.');
    }
  };

  const filteredProjects = projectsData.filter((project) => {
    const lowerCaseQuery = search.toLowerCase();
    return (
      project.projectName.toLowerCase().includes(lowerCaseQuery) ||
      project.author.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const deleteProject = async (id) => {
    try {
      await projectApi.deleteProjectAPI(id);
      setProjectsData(projectsData.filter((project) => project.id !== id));
    } catch (error) {
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const createProject = async (projectName, projectDescription) => {
    try {
      const data = await projectApi.createProjectAPI({
        title: projectName,
        summary: projectDescription,
      });

      if (data) {
        const newProject = {
          id: data.data,
          imageSrc: getValidImageUrl(''),
          projectName,
          author: currentUser.username,
          description: projectDescription,
        };

        console.log(newProject);
        setProjectsData([...projectsData, newProject]);
        setShowAddProjectModal(false);

        // 프로젝트 상세 구현 페이지로 이동
        navigate(`/project/${data.data}`);
      }
    } catch (error) {
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleShowSummary = (project) => {
    setSelectedProject(project);
    setShowProjectSummaryModal(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchProjects();
    }
  }, [isAuthenticated]);

  return (
    <div className="projects-page">
      <Header />
      <div className="user-management">
        <div className="users-header">
          <div className="title-and-add">
            <h1 className="my-users">사용자 관리</h1>
            <button
              className="add-button"
              onClick={() => setShowAddUserModal(true)}
            >
              추가
            </button>
          </div>
        </div>
        {/* <hr className="my-users-hr" /> */}
        <div className="users-wrapper">
          <div className="users-container">
            {usersData.map((user) => (
              <UserContent
                key={user.id}
                {...user}
                onViewAll={() => setShowViewAllModal(true)}
              />
            ))}
          </div>
        </div>
        {showAddUserModal && (
          <Modal
            child={
              <AddUserModalContent
                closeModal={() => setShowAddUserModal(false)}
                onCreate={addUser}
              />
            }
            closeModal={() => setShowAddUserModal(false)}
          />
        )}
        {showViewAllModal && (
          <Modal
            child={
              <ViewAllUsersModalContent
                users={usersData.filter((user) => !user.isViewAll)}
                closeModal={() => setShowViewAllModal(false)}
                deleteUser={deleteUser}
                currentRole={currentUser.role}
              />
            }
            closeModal={() => setShowViewAllModal(false)}
          />
        )}
      </div>

      <div className="projects-header">
        <div className="title-and-add">
          <h1 className="my-project">내 프로젝트</h1>
          <button
            className="add-button"
            onClick={() => setShowAddProjectModal(true)}
          >
            추가
          </button>
        </div>
        <input
          className="project-details"
          type="text"
          placeholder="프로젝트 이름 또는 작성자 검색 "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* <hr className="my-pjt-hr"></hr> */}
      <div className="projects-wrapper">
        <div className="projects-container">
          {filteredProjects.map((project) => (
            <ProjectContent
              key={project.id}
              {...project}
              deleteProject={deleteProject}
              onShowSummary={() => handleShowSummary(project)}
            />
          ))}
        </div>
      </div>
      {showAddProjectModal && (
        <Modal
          child={
            <AddProjectModalContent
              closeModal={() => setShowAddProjectModal(false)}
              onCreate={createProject}
            />
          }
          closeModal={() => setShowAddProjectModal(false)}
        />
      )}
      {showProjectSummaryModal && selectedProject && (
        <Modal
          child={<ProjectSummaryModalContent project={selectedProject} />}
          closeModal={() => setShowProjectSummaryModal(false)}
        />
      )}
      <FooterDark />
    </div>
  );
};

export default ProjectList;

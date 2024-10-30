import React, { useState, useEffect } from 'react';
import './ProjectDashboard.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProjectContent from '../components/ProjectDashboardPage/ProjectContent';
import AddProjectModal from '../components/ProjectDashboardPage/AddProjectModal';
import ProjectSummaryModal from '../components/ProjectDashboardPage/ProjectSummaryModal';
import UserContent from '../components/ProjectDashboardPage/UserContent';
import AddUserModal from '../components/ProjectDashboardPage/AddUserModal';
import ViewAllUsersModal from '../components/ProjectDashboardPage/ViewAllUsersModal';
import {
  getProjects,
  createProjectAPI,
  deleteProjectAPI,
} from '../api/Diagram';
import { addUserAPI, getUsers } from '../api/User';
import defaultImage from '../assets/images/default_Image.webp';

const ProjectDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [projectsData, setProjectsData] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProjectSummaryModal, setShowProjectSummaryModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [usersData, setUsersData] = useState([
    {
      id: 'view-all',
      name: '전체보기',
      isViewAll: true,
    },
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);

  const getValidImageUrl = (tnImgUrl) => {
    return tnImgUrl && tnImgUrl.trim() !== '' ? tnImgUrl : defaultImage;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response.success) {
          const formattedUsers = response.data.map((user) => ({
            id: user.id,
            username: user.id,
            name: user.name,
            authority: user.authority,
            role: user.role,
          }));

          setUsersData([
            {
              id: 'view-all',
              name: '전체보기',
              isViewAll: true,
            },
            ...formattedUsers,
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error.response);
        alert('사용자 목록을 가져오는데 실패했습니다.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.username !== username) {
      alert('올바르지 않은 접근입니다. 다시 로그인해주세요.');
      navigate('/');
      return;
    }

    const fetchProjects = async () => {
      try {
        const data = await getProjects();

        if (data.success) {
          const formattedProjects = data.data.map((project) => ({
            id: project.id,
            imageSrc: getValidImageUrl(project.tnImgUrl),
            projectName: project.title,
            author: project.username,
            description: project.summary,
          }));

          setProjectsData(formattedProjects);
        } else {
          throw new Error('프로젝트 데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        alert('프로젝트 데이터를 가져오는데 실패했습니다.');
      }
    };

    fetchProjects();
  }, [currentUser, username, navigate, isAuthenticated]);

  const addUser = async (userData) => {
    try {
      const response = await addUserAPI(userData);
      if (response.success) {
        const newUser = {
          id: userData.id,
          username: userData.id,
          name: userData.name,
          authority: userData.authority,
        };
        setUsersData((prev) => [...prev, newUser]);
        setShowAddUserModal(false);
      } else {
        alert('사용자 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error in addUser:', error);
      alert('사용자 생성에 실패했습니다.');
    }
  };

  const handleViewAllUsers = () => {
    setShowViewAllModal(true);
  };

  const deleteUser = (username) => {
    setUsersData(usersData.filter((user) => user.username !== username));
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
      await deleteProjectAPI(id);
      setProjectsData(projectsData.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const createProject = async (projectName, projectDescription) => {
    try {
      const data = await createProjectAPI({
        title: projectName,
        summary: projectDescription,
      });

      if (data) {
        const newProject = {
          id: data.id,
          imageSrc: getValidImageUrl(data.tnImgUrl),
          projectName: data.title,
          author: data.username,
          description: data.summary,
        };

        setProjectsData([...projectsData, newProject]);
        setShowAddProjectModal(false);

        // 프로젝트 상세 구현 페이지로 이동
        navigate('/project-detail', {
          //실제 구성도 페이지 url은 무엇?
          state: { projectName, projectDescription },
        });
      } else {
        throw new Error('프로젝트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to add project:', error);
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleShowSummary = (project) => {
    setSelectedProject(project);
    setShowProjectSummaryModal(true);
  };

  return (
    <div className="projects-page">
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
        <hr className="my-users-hr" />
        <div className="users-wrapper">
          <div className="users-container">
            {usersData.map((user) => (
              <UserContent
                key={user.id}
                {...user}
                onViewAll={handleViewAllUsers}
              />
            ))}
          </div>
        </div>
        {showAddUserModal && (
          <AddUserModal
            closeModal={() => setShowAddUserModal(false)}
            onCreate={addUser}
          />
        )}
        {showViewAllModal && (
          <ViewAllUsersModal
            users={usersData.filter((user) => !user.isViewAll)}
            closeModal={() => setShowViewAllModal(false)}
            deleteUser={deleteUser}
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
      <hr className="my-pjt-hr"></hr>
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
        <AddProjectModal
          closeModal={() => setShowAddProjectModal(false)}
          onCreate={createProject}
        />
      )}
      {showProjectSummaryModal && selectedProject && (
        <ProjectSummaryModal
          project={selectedProject}
          closeModal={() => setShowProjectSummaryModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDashboard;

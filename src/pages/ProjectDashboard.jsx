import React, { useState, useEffect } from "react";
import "./ProjectDashboard.css";
import { useParams, useNavigate } from "react-router-dom";
import ProjectContent from "../components/ProjectDashboardPage/ProjectContent";
import AddProjectModal from "../components/ProjectDashboardPage/AddProjectModal";
import ProjectSummaryModal from "../components/ProjectDashboardPage/ProjectSummaryModal";
import UserContent from "../components/ProjectDashboardPage/UserContent";
import AddUserModal from "../components/ProjectDashboardPage/AddUserModal";
import ViewAllUsersModal from "../components/ProjectDashboardPage/ViewAllUsersModal";

const ProjectDashboard = ({ currentUser }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [projectsData, setProjectsData] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProjectSummaryModal, setShowProjectSummaryModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [usersData, setUsersData] = useState([
    {
      id: "view-all",
      name: "전체보기",
      isViewAll: true,
      imageSrc: "/images/all_users_icon.png",
    },
    {
      id: "1",
      username: "sohottoday",
      name: "최성연",
      password: "1q2w3e4r",
      imageSrc: "/images/user_icon.png",
    },
    {
      id: "2",
      username: "kisuckzzang",
      name: "이기석",
      password: "1234qwer",
      imageSrc: "/images/user_icon.png",
    },
    {
      id: "3",
      username: "zizonys",
      name: "김예슬",
      password: "9o8i7u6y",
      imageSrc: "/images/user_icon.png",
    },
    {
      id: "4",
      username: "showmethemoney",
      name: "진광환",
      password: "zxcvbnm",
      imageSrc: "/images/user_icon.png",
    },
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.username !== username) {
      alert("올바르지 않은 접근입니다. 다시 로그인해주세요.");
      navigate("/");
      return;
    }

    // 사용자별 프로젝트 데이터를 로드.
    // 실제로는 API 호출 등을 통해 데이터를 가져와야 함
    const fetchProjects = async () => {
      const userProjects = [
        {
          id: 2,
          imageSrc: "/images/space.jpg",
          projectName: "프로젝트 이름",
          author: "작성자",
          description: "프로젝트 설명을 간단하게 넣을지 말지 고민 중",
          lastEditor: "홍길동",
          creationDate: "2023-10-01",
          lastModifiedDate: "2023-10-10",
        },
        {
          id: 3,
          imageSrc: "/images/building.jpg",
          projectName: "안동 데이터 센터 구조도",
          author: "최성연",
          description: "프로젝트 설명을 여기에 넣을지 말지 고민 중",
        },
        {
          id: 4,
          imageSrc: "/images/target.jpg",
          projectName: "판교 DB센터 4층",
          author: "이기석",
          description: "상세 내용을 여기 넣을지?",
        },
        {
          id: 5,
          imageSrc: "/images/default_Image.webp",
          projectName: "판교 DB센터 4층",
          author: "이기석",
          description: "상세 내용을 여기 넣을지?",
        },
        {
          id: 6,
          imageSrc: "/images/default_Image.webp",
          projectName: "판교 DB센터 4층",
          author: "이기석",
          description: "상세 내용을 여기 넣을지?",
        },
      ];

      setProjectsData(userProjects);
    };

    fetchProjects();
  }, [currentUser, username, navigate]);

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const addUser = (user) => {
    setUsersData([...usersData, user]);
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

  const handleDeleteProject = (id) => {
    // 나중에API 호출을 통해 삭제 요청하는거 만들기
    setProjectsData(projectsData.filter((project) => project.id !== id));
  };

  const handleAddProject = () => {
    setShowAddProjectModal(true);
  };

  const handleShowSummary = (project) => {
    setSelectedProject(project);
    setShowProjectSummaryModal(true);
  };

  // 삭제 예정
  console.log("currentUser:", currentUser);
  console.log("URL username:", username);

  return (
    <div className="projects-page">
      <div className="user-management">
        <div className="users-header">
          <div className="title-and-add">
            <h1 className="my-users">사용자 관리</h1>
            <button className="add-button" onClick={handleAddUser}>
              +
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
          <button className="add-button" onClick={handleAddProject}>
            +
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
              deleteProject={handleDeleteProject}
              onShowSummary={() => handleShowSummary(project)}
            />
          ))}
        </div>
      </div>
      {showAddProjectModal && (
        <AddProjectModal
          closeModal={() => setShowAddProjectModal(false)}
          onCreate={(projectName, projectDescription) => {
            navigate("/add-project-detail", {
              state: { projectName, projectDescription },
            });
          }}
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

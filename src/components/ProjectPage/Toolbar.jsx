import { NetworkContext } from '../../contexts/NetworkContext';
import { AddButton } from './Buttons/AddButton';
import { useContext, useEffect, useState, useRef } from 'react';
import './Toolbar.css';
import { Modal } from '../common/Modal';
import { CreateNodeContent } from './ModalContents/CreateNodeContent';
import { useAuth } from '../../contexts/AuthContext';
import RotatingText from './RotatingText';
import { updateDiagramThumbnail } from '../../api/Diagram';
import Dropdown from './DropDown';
import { FaBaby, FaCog, FaPowerOff, FaUser } from 'react-icons/fa';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HIDDEN_CLASSNAME = 'hidden';
const NO_AUTHORITY_MESSAGE = '권한이 없습니다. 관리자에게 권한을 요청하세요';

const Toolbar = () => {
  const {
    selectedSize,
    setSelectedSize,
    cyRef,
    curProjectId,
    nodes,
    updateNodeSize,
    setNodes,
    pushMessages,
    setPushMessages,
    pushOptions,
    setPushOptions,
    setDataReady,
    isLinking,
    setIsLinking,
    isObjectDelete,
    setIsObjectDelete,
    updateBgImg,
    isEditingPermitted,
    isEditing,
    setIsEditing,
  } = useContext(NetworkContext);
  const { currentUser } = useAuth();

  const [isEditingDisabled, setIsEditingDisabled] = useState(false);
  const [inputSize, setInputSize] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChild, setModalChild] = useState('addNode');
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const sentences = [
    '이상 없음',
    '[24/11/25 03:31:14] "DESKTOP_업무_09" 장비 CPU에서 위험을 감지했습니다. (실측치: 50.8%, 임계치: 50%)',
    '[24/11/25 03:31:14] "DESKTOP_업무_09" 장비 MEM에서 위험을 감지했습니다. (실측치: 55.3386%, 임계치: 50%)',
  ];

  // 구성도 편집 - ALL권한용 기능모음

  const toggleEditing = () => {
    if (isEditingDisabled) return; // 비활성화 중이면 클릭 무시

    // 버튼 클릭 이벤트 처리
    if (currentUser.authority === 'ALL') {
      setIsEditing((prevState) => !prevState);

      // 0.5초 동안 버튼 비활성화
      setIsEditingDisabled(true);
      setTimeout(() => setIsEditingDisabled(false), 1000);
    }
  };

  useEffect(() => {
    if (cyRef.current && curProjectId && selectedSize) {
      if (nodes.length > 1 && nodes[1].data.nodeSize !== selectedSize) {
        if (!isEditingPermitted) {
          alert(NO_AUTHORITY_MESSAGE);
          return;
        }
        updateNodeSize();
      }
      setInputSize(selectedSize);
    }
  }, [selectedSize]);

  const handleSizeButtonClick = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }
    setSelectedSize(parseInt(inputSize, 10));
    setModalOpen(false);
  };

  const toggleAddNode = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }
    setModalChild('addNode');
    setModalOpen(true);
  };
  const activeAddLink = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    setIsLinking(true);
  };
  const inactiveAddLink = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    setIsLinking(false);
  };
  const activeDeleteObject = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    setIsObjectDelete(true);
  };
  const inactiveDeleteObject = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    setIsObjectDelete(false);
  };

  const toggleEditSize = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }
    setModalChild('editSize');
    setModalOpen(true);
  };

  const toggleUpdateProjectInfo = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }
    setModalChild('updateProjectInfo');
    setModalOpen(true);
  };

  const onBgImgBtnClick = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    let result;
    const file = event.target.files[0];

    if (file) {
      let ok = confirm(`${file.name}을 배경이미지로 등록하시겠습니까?`);

      if (ok) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          await updateBgImg(formData);
          alert('배경 이미지가 성공적으로 업데이트되었습니다.');
        } catch (error) {
          alert('배경 이미지 업데이트에 실패했습니다.');
        }
        setDataReady(true);
      }
    }
  };

  const onThumbnailBtnClick = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    thumbnailInputRef.current.click();
  };

  const handleThumbnailFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const confirmUpload = confirm(
        `${file.name}을 썸네일 이미지로 등록하시겠습니까?`,
      );
      if (confirmUpload) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          await updateDiagramThumbnail(curProjectId, formData);
          alert('썸네일 이미지가 성공적으로 업데이트되었습니다.');
        } catch (error) {
          alert('썸네일 이미지 업데이트에 실패했습니다.');
        }
      }
    }
  };

  function getChildNodes(parentId) {
    const cy = cyRef.current;

    const childNodes = cy.nodes().filter((node) => {
      return node.data('parent') === parentId;
    });

    return childNodes;
  }

  const group = () => {
    const cy = cyRef.current;

    const selectedNodes = cy.nodes('node:selected');
    if (selectedNodes.length > 1) {
      const hasParent = selectedNodes.some((node) => node.data('parent'));

      // 선택된 노드 중 하나가 그룹에 속해있으면  그룹화 해제요구 메세지 띄우기
      if (hasParent) {
        alert('그룹을 먼저 해제해주세요');
        return;
      }

      // 모든 노드가 그룹에 속해있지 않다면 그룹화
      const groupId = `group-${Date.now()}`;
      cy.add({ group: 'nodes', data: { id: groupId }, classes: 'group' });

      selectedNodes.forEach((node) => {
        `group${Date.now()}`;
        node.move({ parent: groupId });
      });

      setNodes(cy.elements().map((ele) => ele.json()));
    }
  };

  const ungroup = () => {
    const cy = cyRef.current;

    const selectedGroups = cy.nodes('.group:selected');

    if (selectedGroups.length > 0) {
      selectedGroups.forEach((selectedGroup) => {
        const children = getChildNodes(selectedGroup.id()); // 노드의 ID를 사용하여 자식 검색
        children.forEach((child) => child.move({ parent: null }));
        selectedGroup.remove();
      });
    } else return;
    setNodes(cy.elements().map((ele) => ele.json()));
  };

  const handleSizeInputChange = (e) => {
    setInputSize(e.target.value);
  };

  // 상수 선언
  const toolMenuTitles = [
    '노드 추가',
    isLinking ? '링크 모드 종료' : '링크 추가 모드',
    isObjectDelete ? '제거 모드 종료' : '요소 제거 모드',
    '노드 크기 조절',
  ];

  const projectMenuTitles = [
    '프로젝트 정보 수정',
    '프로젝트 썸네일 편집',
    '구성도 배경 편집',
  ];

  const toolMenuDetails = [
    '실장비, 커스텀 노드를 추가합니다.',
    isLinking ? '모드를 종료합니다.' : '링크를 추가합니다.',
    isObjectDelete ? '모드를 종료합니다.' : '노드, 링크를 제거합니다.',
    '노드의 전체 크기를 수정합니다.',
  ];

  const projectMenuDetails = [
    '해당 프로젝트의 정보를 수정합니다.',
    '프로젝트 썸네일을 편집합니다.',
    '장비 구성도의 배경이미지를 수정합니다.',
  ];

  const toolMenuIcons = [<FaUser />, <FaCog />, <FaPowerOff />, <FaBaby />];

  const projectMenuIcons = [<FaUser />, <FaCog />, <FaPowerOff />];

  const toolMenuFunctions = [
    toggleAddNode,
    isLinking ? inactiveAddLink : activeAddLink,
    isObjectDelete ? inactiveDeleteObject : activeDeleteObject,
    toggleEditSize,
  ];

  const projectMenuFunctions = [
    toggleUpdateProjectInfo,
    onThumbnailBtnClick,
    onBgImgBtnClick,
  ];

  const modalContents = {
    addNode: <CreateNodeContent closeModal={() => setModalOpen(false)} />,
    editSize: (
      <>
        <label htmlFor="sizeInput">노드 크기 조절</label>
        <input
          id="sizeInput"
          type="number"
          min="20"
          max="100"
          value={inputSize}
          onChange={handleSizeInputChange}
          placeholder="20 - 100"
          disabled={!isEditing}
        />
        <button
          disabled={!isEditing}
          className="toolbar-button"
          onClick={handleSizeButtonClick}
        >
          확인
        </button>
      </>
    ),
    updateProjectInfo: <></>,
  };

  return (
    <div className="toolbar">
      <div className="hidden-elements">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {modalOpen && (
          <Modal
            child={modalContents[modalChild]}
            closeModal={() => setModalOpen(false)}
          />
        )}
      </div>
      {isEditing ? (
        <div
          className={`diagram-editing-tools ${isEditing ? '' : 'tool-hidden'}`}
        >
          <Dropdown
            title="프로젝트"
            menuTitles={projectMenuTitles}
            menuDetails={projectMenuDetails}
            menuIcons={projectMenuIcons}
            menuFunctions={projectMenuFunctions}
          />
          <Dropdown
            title="도구"
            menuTitles={toolMenuTitles}
            menuDetails={toolMenuDetails}
            menuIcons={toolMenuIcons}
            menuFunctions={toolMenuFunctions}
          />
        </div>
      ) : (
        <div className="tb-alert-message-container">
          <RotatingText interval={3000} />
          <div
            className="icon-container"
            onClick={() => {
              console.log('dd');
            }}
          >
            <i className="bi bi-sliders"></i>
          </div>
        </div>
      )}
      {isEditingPermitted && (
        <>
          <button
            disabled={!isEditingPermitted}
            className="toolbar-button toolbar-edit-button"
            onClick={toggleEditing}
          >
            편집{isEditing ? '비활성' : '활성'}
          </button>
          <input
            type="file"
            ref={thumbnailInputRef}
            style={{ display: 'none' }}
            onChange={handleThumbnailFileChange}
          />
        </>
      )}
    </div>
  );
};

export default Toolbar;

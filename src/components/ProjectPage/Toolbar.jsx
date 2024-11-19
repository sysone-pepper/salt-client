import { NetworkContext } from '../../contexts/NetworkContext';
import { AddButton } from './Buttons/AddButton';
import { useContext, useEffect, useState, useRef } from 'react';
import './Toolbar.css';
import { Modal } from '../common/Modal';
import { CreateNodeContent } from './ModalContents/CreateNodeContent';
import { useAuth } from '../../contexts/AuthContext';
import { updateDiagramThumbnail } from '../../api/Diagram';

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
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

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
  };

  const toggleAddNode = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

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
        await updateBgImg(formData);
        setDataReady(true);
      }
    }
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

  const onThumbnailBtnClick = () => {
    if (!isEditingPermitted) {
      alert(NO_AUTHORITY_MESSAGE);
      return;
    }

    thumbnailInputRef.current.click();
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
            child={<CreateNodeContent closeModal={() => setModalOpen(false)} />}
            closeModal={() => setModalOpen(false)}
          />
        )}
      </div>
      {isEditing && (
        <div
          className={`diagram-editing-tools ${isEditing ? '' : 'tool-hidden'}`}
        >
          <AddButton
            fileName={'object-icon.png'}
            onClickEvent={toggleAddNode}
            disabled={!isEditing || isLinking || isObjectDelete || modalOpen}
          >
            요소 추가
          </AddButton>
          {isLinking ? (
            <AddButton
              fileName={'link-icon.png'}
              onClickEvent={inactiveAddLink}
              needCancel={true}
              disabled={!isEditing}
            >
              링크추가모드 끄기
            </AddButton>
          ) : (
            <AddButton
              fileName={'link-icon.png'}
              onClickEvent={activeAddLink}
              disabled={!isEditing || isObjectDelete || modalOpen}
            >
              링크추가모드 켜기
            </AddButton>
          )}

          {isObjectDelete ? (
            <AddButton
              fileName={'object-delete-icon.png'}
              onClickEvent={inactiveDeleteObject}
              needCancel={true}
              disabled={!isEditing}
            >
              구성도 제거모드 끄기
            </AddButton>
          ) : (
            <AddButton
              fileName={'object-delete-icon.png'}
              onClickEvent={activeDeleteObject}
              needCancel={false}
              disabled={!isEditing || isLinking || modalOpen}
            >
              구성도 제거모드 켜기
            </AddButton>
          )}

          <AddButton
            fileName={'background-icon.png'}
            onClickEvent={onBgImgBtnClick}
            needCancel={false}
            for="bgImgInput"
            disabled={!isEditing || isLinking || isObjectDelete || modalOpen}
          >
            배경 이미지 수정
          </AddButton>

          <AddButton
            fileName={'thumbnail-icon.png'}
            onClickEvent={onThumbnailBtnClick}
            needCancel={false}
            disabled={!isEditing || isLinking || isObjectDelete || modalOpen}
          >
            썸네일 이미지 수정
          </AddButton>

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
        </div>
      )}
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
    </div>
  );
};

export default Toolbar;

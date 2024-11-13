import { NetworkContext } from '../../contexts/NetworkContext';
import { AddButton } from './Buttons/AddButton';
import { useContext, useEffect, useState, useRef } from 'react';
import './Toolbar.css';
import { Modal } from '../common/Modal';
import { CreateNodeContent } from './ModalContents/CreateNodeContent';

const HIDDEN_CLASSNAME = 'hidden';
const NO_AUTHORITY_MESSAGE = '권한이 없습니다. 관리자에게 권한을 요청하세요';

const Toolbar = () => {
  const {
    isSidebarPanned,
    setIsSidebarPanned,
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
    isNavigatorToggled,
    setIsNavigatorToggled,
    updateBgImg,
    isEditingPermitted,
  } = useContext(NetworkContext);

  const [inputSize, setInputSize] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // 구성도 조회 - read-only권한용 기능모음
  const handlePannigButtonClick = () => {
    setIsSidebarPanned((prevState) => !prevState);
  };

  const toggeleNavigator = () => {
    const navigator = document.getElementsByClassName('cytoscape-navigator')[0];
    setIsNavigatorToggled((prevState) => {
      if (prevState) {
        navigator.classList.add(HIDDEN_CLASSNAME);
      } else {
        navigator.classList.remove(HIDDEN_CLASSNAME);
      }
      return !prevState;
    });
  };

  // 구성도 편집 - ALL권한용 기능모음
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
      <div className="diagram-browsing-tools">
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
        {/* <button className="toolbar-button" onClick={handlePannigButtonClick}>
          사이드바 {isSidebarPanned ? '접기' : '펼치기'}
        </button> */}
        <AddButton
          fileName={'navigator-icon.png'}
          onClickEvent={toggeleNavigator}
          needCancel={!isNavigatorToggled}
        >
          네비게이터 {isNavigatorToggled ? '숨기기' : '호출'}
        </AddButton>
      </div>
      <div className="diagram-editing-tools">
        <AddButton
          fileName={'object-icon.png'}
          onClickEvent={toggleAddNode}
          disabled={isLinking || isObjectDelete || modalOpen}
        >
          요소 추가
        </AddButton>
        {isLinking ? (
          <AddButton
            fileName={'link-icon.png'}
            onClickEvent={inactiveAddLink}
            needCancel={true}
          >
            링크추가모드 끄기
          </AddButton>
        ) : (
          <AddButton
            fileName={'link-icon.png'}
            onClickEvent={activeAddLink}
            disabled={isObjectDelete || modalOpen}
          >
            링크추가모드 켜기
          </AddButton>
        )}

        {isObjectDelete ? (
          <AddButton
            fileName={'object-delete-icon.png'}
            onClickEvent={inactiveDeleteObject}
            needCancel={true}
          >
            구성도 제거모드 끄기
          </AddButton>
        ) : (
          <AddButton
            fileName={'object-delete-icon.png'}
            onClickEvent={activeDeleteObject}
            needCancel={false}
            disabled={isLinking || modalOpen}
          >
            구성도 제거모드 켜기
          </AddButton>
        )}

        <AddButton
          fileName={'background-icon.png'}
          onClickEvent={onBgImgBtnClick}
          needCancel={false}
          for="bgImgInput"
          disabled={isLinking || isObjectDelete || modalOpen}
        >
          배경 이미지 수정
        </AddButton>

        {/* <AddButton fileName={'group.png'} onClickEvent={group}>
          그룹화
        </AddButton>
        <AddButton fileName={'ungroup.png'} onClickEvent={ungroup}>
          그룹 해제
        </AddButton> */}
        <label htmlFor="sizeInput">노드 크기 조절</label>
        <input
          id="sizeInput"
          type="number"
          min="20"
          max="100"
          value={inputSize}
          onChange={handleSizeInputChange}
          placeholder="20 - 100"
        />
        <button className="toolbar-button" onClick={handleSizeButtonClick}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

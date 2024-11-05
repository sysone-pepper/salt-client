import React, { useContext, useRef, useState } from 'react';
import { AddButton } from './Buttons/AddButton';
import { Modal } from '../common/Modal';
import { NetworkContext } from '../../contexts/NetworkContext';
import { CreateNodeContent } from './ModalContents/CreateNodeContent';
import './ToolBox.css';

const HIDDEN_CLASSNAME = 'hidden';

export const ToolBox = () => {
  const {
    nodes,
    setNodes,
    isLinking,
    setIsLinking,
    isObjectDelete,
    setIsObjectDelete,
    cyRef,
    isNavigatorToggled,
    setIsNavigatorToggled,
    updateBgImg,
  } = useContext(NetworkContext);

  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const toggleAddNode = () => {
    setModalOpen(true);
  };
  const activeAddLink = () => {
    setIsLinking(true);
  };
  const inactiveAddLink = () => {
    setIsLinking(false);
  };
  const activeDeleteObject = () => {
    setIsObjectDelete(true);
  };
  const inactiveDeleteObject = () => {
    setIsObjectDelete(false);
  };
  const onBgImgBtnClick = () => {
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
        result = await updateBgImg(formData);

        if (result.success) {
          const newNodes = nodes.map((node) => {
            if (node.data.id === 'background') {
              console.log(result.data);
              node.data.src = result.data;
            }
            return node;
          });
          setNodes(newNodes);
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

  return (
    <>
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
      <div className="tool-box-container">
        <AddButton
          fileName={'object-icon.png'}
          onClickEvent={toggleAddNode}
          disabled={isLinking}
        >
          요소 추가
        </AddButton>
        <AddButton
          fileName={'navigator-icon.png'}
          onClickEvent={toggeleNavigator}
          needCancel={!isNavigatorToggled}
        >
          네비게이터 {isNavigatorToggled ? '숨기기' : '호출'}
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
            disabled={false}
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
          >
            구성도 제거모드 켜기
          </AddButton>
        )}

        <AddButton
          fileName={'background-icon.png'}
          onClickEvent={onBgImgBtnClick}
          needCancel={false}
          for="bgImgInput"
        >
          배경 이미지 수정
        </AddButton>

        {/* <AddButton fileName={'group.png'} onClickEvent={group}>
          그룹화
        </AddButton>
        <AddButton fileName={'ungroup.png'} onClickEvent={ungroup}>
          그룹 해제
        </AddButton> */}
      </div>
    </>
  );
};

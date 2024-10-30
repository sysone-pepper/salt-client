import React, { useContext, useRef } from 'react';
import { AddButton } from './Buttons/AddButton';
import './ToolBox.css';
import { NetworkContext } from '../../contexts/NetworkContext';

const HIDDEN_CLASSNAME = 'hidden';

export const ToolBox = () => {
  const {
    isLinking,
    setIsLinking,
    setIsModalOpen,
    setCurModalType,
    setIsUngroupNeeded,
    cyRef,
    isNavigatorToggled,
    setIsNavigatorToggled,
  } = useContext(NetworkContext);
  const toggleAddNode = () => {
    setIsModalOpen(true);
    setCurModalType('create');
  };
  const activeAddLink = () => {
    setIsLinking(true);
  };
  const inactiveAddLink = () => {
    setIsLinking(false);
  };
  function getChildNodes(parentId) {
    const cy = cyRef.current;

    const childNodes = cy.nodes().filter((node) => {
      return node.data('parent') === parentId;
    });

    return childNodes;
  }

  const group = () => {
    setIsUngroupNeeded(false);
    const cy = cyRef.current;

    const selectedNodes = cy.nodes('node:selected');
    if (selectedNodes.length > 1) {
      const hasParent = selectedNodes.some((node) => node.data('parent'));

      // 선택된 노드 중 하나가 그룹에 속해있으면 IsUngroupNeeded를 true로 돌려서 그룹화 해제요구 메세지 띄우기
      if (hasParent) {
        setIsUngroupNeeded(true);
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
    <div className="tool-box-container">
      <AddButton fileName={'object-icon.png'} onClickEvent={toggleAddNode}>
        요소 추가
      </AddButton>
      <AddButton
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
        <AddButton fileName={'link-icon.png'} onClickEvent={activeAddLink}>
          링크추가모드 켜기
        </AddButton>
      )}

      <AddButton fileName={'group.png'} onClickEvent={group}>
        그룹화
      </AddButton>
      <AddButton fileName={'ungroup.png'} onClickEvent={ungroup}>
        그룹 해제
      </AddButton>
    </div>
  );
};

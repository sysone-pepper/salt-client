import React, { useContext, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { NetworkContext } from '../../contexts/NetworkContext';
import cytoscape from 'cytoscape';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import cytoscapePopper from 'cytoscape-popper';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import edgehandles from 'cytoscape-edgehandles';
import cyNavigator from 'cytoscape-navigator';
import navConfig from '../../constants/NavigatorConfig';
import ehConfig from '../../constants/EdgeHandleOptions';
import { CustomDeviceNode } from './CustomDeviceNode';
import { CustomIconNode } from './CustomIconNode';
import { CustomTextNode } from './CustomTextNode';
import { getUsers } from '../../api/User';
import { useAuth } from '../../contexts/AuthContext';
import ServerDashboard from '../../pages/ServerDashboard';

import closeIcon from '../../assets/images/add-icon.png';
import openIcon from '../../assets/images/open-navigator-icon.png';
import './NetworkMap.css';
import { Modal } from '../common/Modal';

export const DiagramField = ({ projectId }) => {
  const {
    curProjectId,
    setCurProjectId,
    fetchMapData,
    bgImgInfo,
    updateNode,
    createLink,
    deleteObject,
    cyRef,
    nodes,
    edges,
    dataReady,
    setDataReady,
    setNodes,
    setEdges,
    isLinking,
    isObjectDelete,
    isNavigatorToggled,
    setIsNavigatorToggled,
    setIsEditingPermitted,
    isEditing,
  } = useContext(NetworkContext);

  const { currentUser } = useAuth();

  const [navigatorInitialized, setNavigatorInitialized] = useState(false); // 네비게이터 초기화 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({});

  const tippyFactory = (ref, content) => {
    let dummyDomEle = document.createElement('div');

    let tip = tippy(dummyDomEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: 'manual',
      placement: 'bottom',
      content: content,
    });

    return tip;
  };

  const registerCytoscapeExtensions = () => {
    cytoscape.use(cytoscapePopper(tippyFactory));
    cytoscape.use(edgehandles);
    nodeHtmlLabel(cytoscape);
    cyNavigator(cytoscape);
  };

  const fetchUserAuthority = async () => {
    // TODO: Authority 나중에 토큰에서 넘겨줄 예정
    try {
      const response = await getUsers(); //
      if (response.success) {
        const { users, _ } = response.data;
        const userAuthority = users.filter(
          (user) => user.id === currentUser.username,
        )[0].authority;
        setIsEditingPermitted(userAuthority === 'ALL');
      }
    } catch (error) {
      alert('사용자 정보를 가져오는데 실패했습니다.');
    }
  };

  const createCyInstance = (isEditing) => {
    if (!cyRef.current) {
      // cytoscape 기본 인스턴스 생성
      const cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
          {
            selector: 'node[id != "background"][nodeSize][nodeId]',
            style: {
              width: 'data(nodeSize)',
              height: 'data(nodeSize)',
            },
          },
          {
            selector: '.ICON, .TEXT',
            style: {
              'background-opacity': '0',
            },
          },
          {
            selector: '.TEXT',
            style: {
              width: 'data(calculatedWidth)',
              height: 'data(nodeSize)',
            },
          },
        ],
        layout: {
          name: 'preset',
        },

        //항상 활성화
        zoomingEnabled: true, // 노드 줌 활성화
        userZoomingEnabled: true, // 스크롤 줌 활성화

        //조건부 활성 or 비활성
        boxSelectionEnabled: isEditing, // 노드 선택 활성화
        autoungrabify: !isEditing, // 노드 드래그 비활성화
        autolock: !isEditing, // 노드 이동 비활성화
        autounselectify: !isEditing, // 노드 선택 비활성화
      });

      // cytoscape-node-html-label 적용
      cy.nodeHtmlLabel([
        {
          query: '.NEW_DEVICE',
          halign: 'center',
          valign: 'center',
          halignBox: 'center',
          valignBox: 'center',
          cssClass: '',
          tpl(data) {
            return `${ReactDOMServer.renderToString(
              <CustomDeviceNode
                node={cy.getElementById(data.id)}
                data={data}
                isSelected={false}
              />,
            )}`;
          },
        },
        {
          query: '.EXIST_DEVICE',
          halign: 'center',
          valign: 'center',
          halignBox: 'center',
          valignBox: 'center',
          cssClass: '',
          tpl(data) {
            return `${ReactDOMServer.renderToString(
              <CustomDeviceNode
                node={cy.getElementById(data.id)}
                data={data}
                isSelected={false}
                isExistDevice={true}
              />,
            )}`;
          },
        },
        {
          query: '.ICON',
          halign: 'center',
          valign: 'center',
          halignBox: 'center',
          valignBox: 'center',
          cssClass: '',
          tpl(data) {
            return `${ReactDOMServer.renderToString(
              <CustomIconNode node={cy.getElementById(data.id)} data={data} />,
            )}`;
          },
        },
        {
          query: '.TEXT',
          halign: 'center',
          valign: 'center',
          halignBox: 'center',
          valignBox: 'center',
          cssClass: '',
          tpl(data) {
            return `${ReactDOMServer.renderToString(
              <CustomTextNode node={cy.getElementById(data.id)} data={data} />,
            )}`;
          },
        },
      ]);

      cy.on('dragfree', 'node', async (event) => {
        const target = event.target;
        const updatedNode = target.json();
        await updateNode(updatedNode);
      });

      // cytoscape tip popper 적용
      if (!isEditing) {
        cy.on('mouseover', 'node[id != "background"]', (event) => {
          const node = event.target;

          // 팝업 콘텐츠 생성
          const tip = node.popper({
            content: () => {
              let content = document.createElement('div');

              switch (node.data('nodeType')) {
                case 'EXIST_DEVICE':
                  content.innerHTML = `
                  <div>
                    ID : 기존장비-${node.id()} <br>
                    장비명 : ${node.data('deviceAlias')} <br>
                    IP : ${node.data('publicIp')} <br>
                    IPv6 : ${node.data('publicIpV6')} <br>
                    유형 : ${node.data('deviceType')} <br>
                    OS : ${node.data('osType')} <br>
                    제조사 : ${node.data('vendor')} <br>
                  </div>`;
                  break;
                case 'NEW_DEVICE':
                  content.innerHTML = `
                  <div>
                    ID : 신규장비-${node.id()} <br>
                    장비명 : ${node.data('newDeviceAlias')} <br>
                    IP : ${node.data('newDevicePublicIp')} <br>
                    유형 : ${node.data('newDeviceType')} <br>
                    OS : ${node.data('newDeviceOs')} <br>
                    제조사 : ${node.data('newDeviceVendor')} <br>
                  </div>`;
                  break;
                case 'ICON':
                  content.innerHTML = `
                  <div>
                    ID : 아이콘-${node.id()} <br>
                  </div>`;
                  break;
                case 'TEXT':
                  content.innerHTML = `
                  <div>
                    ID : 텍스트-${node.id()} <br>
                  </div>`;
                  break;
                default:
                  content.innerHTML = `<div>알 수 없음<br></div>`;
              }

              return content;
            },
          });

          // 팝업 표시
          tip.show();

          // 마우스를 벗어나면 팝업 숨김
          node.on('mouseout', () => {
            tip.hide();
          });
        });

        cy.on('click', 'node.EXIST_DEVICE', (event) => {
          setSelectedDevice(event.target.json());
          setModalOpen(true);
        });
      }

      return cy;
    }
  };

  const toggleNavigator = () => {
    setIsNavigatorToggled((prevState) => !prevState);
  };

  // 초기화(프로젝트 아이디 컨텍스트 등록)
  useEffect(() => {
    if (curProjectId !== projectId) {
      setCurProjectId(projectId);
      registerCytoscapeExtensions();
      if (currentUser.authority === 'ALL') {
        setIsEditingPermitted(true);
      }
    }
  }, []);

  // cytoscape-navigator 등록 및 언마운트 기능
  useEffect(() => {
    const currentPath = window.location.pathname; // 예: "/project/1/read"
    const basePath = currentPath.split('/').slice(0, 3).join('/'); // "/project/1"

    window.history.pushState(
      null,
      '',
      `${basePath}/${!isEditing ? 'read' : 'edit'}`,
    );

    if (!!curProjectId) {
      if (!cyRef.current) {
        cyRef.current = createCyInstance(isEditing);
        fetchMapData();
      }

      if (!navigatorInitialized && cyRef.current) {
        const navElem = document.getElementById('cytoscape-navigator');
        while (navElem.firstChild) {
          navElem.firstChild.remove();
        }
        cyRef.current.navigator(navConfig);
        setNavigatorInitialized(true);
      }
      return () => {
        cyRef.current?.destroy();
        cyRef.current = null;
        // setNavigatorInitialized(false);
      };
    }
  }, [curProjectId, isEditing]);

  // 배경 이미지 수정
  // TODO: 수정 현재 어느 시점에서 배경이미지를 못읽어와 에러가 발생함
  useEffect(() => {
    if (bgImgInfo && cyRef.current && dataReady) {
      const cy = cyRef.current;
      const bgNode = cy.getElementById('background');

      if (bgNode && bgNode.data('src') !== bgImgInfo.src) {
        const newNodes = [...nodes].map((node, idx) => {
          if (idx === 0) {
            const newBgNode = { ...bgNode.json() };

            newBgNode.data.src = bgImgInfo.src;
            newBgNode.data.size = bgImgInfo.size;
            newBgNode.style = {
              'z-index': -1,
              'z-compound-depth': 'bottom',
              width: bgImgInfo.size.width,
              height: bgImgInfo.size.height,
              shape: 'rectangle',
              'background-image': `url(${bgImgInfo.src})`,
              'background-fit': 'cover',
              events: 'no',
            };
            return newBgNode;
          }
          return node;
        });
        setNodes(newNodes);

        // 노드의 최소 및 최대 좌표를 초기화
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;

        // 모든 노드를 순회하며 최소/최대 좌표 구하기
        newNodes.forEach((node, idx) => {
          if (idx > 0) {
            const pos = node.position;
            minX = Math.min(minX, pos.x);
            minY = Math.min(minY, pos.y);
            maxX = Math.max(maxX, pos.x);
            maxY = Math.max(maxY, pos.y);
          }
        });

        const nodeWidth = maxX - minX;
        const nodeHeight = maxY - minY;

        const cyWidth = cy.width();
        const cyHeight = cy.height();

        const bgWidth = bgImgInfo.size.width;
        const bgHeight = bgImgInfo.size.height;

        cy.pan({ x: 0, y: 0 });
        cy.panBy({ x: cyWidth / 2, y: cyHeight / 2 });

        // option 1-1: 이미지 영역을 초과하는 노드를 고려하여 초기 화면 크기 계산
        // const zoomX = Math.min(cyWidth / nodeWidth, cyWidth / bgWidth);
        // const zoomY = Math.min(cyHeight / nodeHeight, cyHeight / bgHeight);

        // option 1-2: 이미지 영역에 초점을 맞춰 초기화면 크기 설정
        const zoomX = cyWidth / bgWidth;
        const zoomY = cyHeight / bgHeight;

        // option 2-1: 이미지가 화면에 꽉차도록 설정
        // const zoomLevel = Math.max(zoomX, zoomY);

        // option 2-2: 전체 이미지가 화면에 담길 수 있도록 설정
        const zoomLevel = Math.min(zoomX, zoomY);
        cy.zoom(zoomLevel);

        cy.minZoom(Math.min(zoomX, zoomY) / 2);
        cy.maxZoom(zoomLevel * 2);
      }

      setNavigatorInitialized(false);
      setDataReady(false);
    }
  }, [bgImgInfo, dataReady]);

  // 노드, 엣지 변동(추가, 수정, 삭제) 기능
  useEffect(() => {
    if (cyRef.current) {
      if (nodes.length > 0) {
        setDataReady(true);
      }
      const cy = cyRef.current;

      // 성능 최적화를 위해 배치로 작업 시작 명시
      cy.startBatch();

      cy.nodes().remove();
      cy.edges().remove();
      cy.add([...nodes, ...edges]);

      cy.endBatch();
    }
  }, [nodes, edges]);

  // cytoscape-edgehandler 연결 및 관련 이벤트 마운트/언마운트
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const eh = cy.edgehandles(ehConfig);

      if (isLinking) {
        eh.enableDrawMode();
      } else {
        eh.disableDrawMode();
      }

      cy.on('ehstart', (event, sourceNode) => {
        if (sourceNode.id() === 'background') {
          eh.stop();
        }
      });

      cy.on('ehcomplete', async (event, sourceNode, targetNode, addedEdge) => {
        const edgeId = await createLink(
          sourceNode.data('id'),
          targetNode.data('id'),
        );
        const edge = {
          data: {
            id: 'edge-' + edgeId,
            source: sourceNode.id(),
            target: targetNode.id(),
          },
        };
        setEdges((prevEdges) => [...prevEdges, edge]);
      });

      return () => {
        eh.disableDrawMode();
        cy.off('ehstart');
        cy.off('ehcomplete');
      };
    }
  }, [isLinking]);

  // 오브젝트 삭제
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;

      const handleDelete = async (event) => {
        const target = event.target;
        const nodeName =
          target.data('nodeType') === 'NEW_DEVICE'
            ? `신규 장비 ${target.data('newDeviceName')}`
            : target.data('nodeType') === 'ICON'
            ? `아이콘 ${target.data('id')}`
            : target.data('nodeType') === 'TEXT'
            ? `텍스트 ${target.data('id')}`
            : target.data('nodeType') === 'EXIST_DEVICE'
            ? `기존 장비 ${target.data('deviceName')}`
            : `엣지 ${target.data('id').split('-')[1]}`;

        const permit = confirm(`${nodeName}을(를) 삭제하시겠습니까?`);
        if (permit) {
          await deleteObject(target.json());
        } else {
          alert('취소되었습니다.');
        }
      };

      cy.off('click', 'node[id != "background"], edge', handleDelete);

      if (isObjectDelete) {
        cy.on('click', 'node[id != "background"], edge', handleDelete);
      }

      return () => {
        cy.off('click', 'node[id != "background"], edge', handleDelete);
      };
    }
  }, [isObjectDelete, cyRef, deleteObject]);

  useEffect(() => {
    if (cyRef.current && !isEditing) {
      cyRef.current.on('click', 'node.EXIST_DEVICE', (event) => {
        setSelectedDevice(event.target.json());
        setModalOpen(true);
      });
    }
  }, [cyRef.current, isEditing]);

  // 편집 권한에 따른 Cytoscape 설정 업데이트

  return (
    <div className="diagram-field">
      {!isEditing && modalOpen && (
        <Modal
          className="modal-large"
          child={
            <ServerDashboard
              deviceId={selectedDevice.data.deviceId}
              deviceAlias={selectedDevice.data.deviceAlias}
            />
          }
          closeModal={() => {
            setModalOpen(false);
            setSelectedDevice({});
          }}
        />
      )}
      <div
        id="cy"
        style={{
          border: '1px solid black',
        }}
      />
      <div
        className={`navigator-container ${
          isNavigatorToggled ? '' : 'collapsed'
        }`}
      >
        <div
          id="cytoscape-navigator"
          // cytoscape-navigator를 커스터마이징 하여 div에 직접 적용할 경우 해당 스타일이 미리 정의되어야합니다.
          // 추후 해당 사안을 개선하겠습니다.
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bottom: 0,
            backgroundColor: '#f4f4f4',
            overflow: 'hidden',
            zIndex: 500,
          }}
        />
        <div className="toggle-navigator-btn" onClick={toggleNavigator}>
          {isNavigatorToggled ? (
            <img className="close-navigator-icon" src={closeIcon} />
          ) : (
            <img className="open-navigator-icon" src={openIcon} />
          )}
        </div>
      </div>
    </div>
  );
};

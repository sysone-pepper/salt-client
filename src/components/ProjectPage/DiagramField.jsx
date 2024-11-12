import React, { useContext, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ToolBox } from './ToolBox';
import { NetworkContext } from '../../contexts/NetworkContext';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import cytoscapePopper from 'cytoscape-popper';
import edgehandles from 'cytoscape-edgehandles';
import cyNavigator from 'cytoscape-navigator';
import navConfig from '../../constants/NavigatorConfig';
import ehConfig from '../../constants/EdgeHandleOptions';
import { CustomDeviceNode } from './CustomDeviceNode';
import { CustomIconNode } from './CustomIconNode';
import Sidebar from './Sidebar/Sidebar';
import { CustomTextNode } from './CustomTextNode';

const registerCytoscapeExtensions = () => {
  cytoscape.use(dagre);
  cytoscape.use(cytoscapePopper);
  cytoscape.use(edgehandles);
  nodeHtmlLabel(cytoscape);
  cyNavigator(cytoscape);
};

registerCytoscapeExtensions();

export const DiagramField = ({ projectId }) => {
  const {
    curProjectId,
    setCurProjectId,
    fetchMapData,
    bgImgInfo,
    updateNode,
    updateNodeSize,
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
    setIsObjectDelete,
    selectedSize,
    setSelectedSize,
    isSidebarPanned,
    setIsSidebarPanned,
  } = useContext(NetworkContext);

  const [navigatorInitialized, setNavigatorInitialized] = useState(false); // 네비게이터 초기화 상태
  const [inputSize, setInputSize] = useState(20);

  const handleSizeInputChange = (e) => {
    setInputSize(e.target.value);
  };

  const handleSizeButtonClick = () => {
    setSelectedSize(parseInt(inputSize, 10));
  };

  const createCyInstance = () => {
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
        autoungrabify: false,
        boxSelectionEnabled: true,
        zoomingEnabled: true,
        userZoomingEnabled: true,
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
      cy.on('mouseover', 'node[id != "background"]', (event) => {
        const node = event.target;
        const popper = node.popper({
          content: () => {
            switch (node.data('nodeType')) {
              case 'EXIST_DEVICE':
                return `
                    <div>
                        ID : 기존장비-${node.id()} <br>
                        장비명 : ${node.data('deviceAlias')} <br>
                        IP : ${node.data('publicIp')} <br>
                        IPv6 : ${node.data('publicIpV6')} <br>
                        유형 : ${node.data('deviceType')} <br>
                        OS : ${node.data('osType')} <br>
                        제조사 : ${node.data('vendor')} <br>
                    </div>
                    `;
              case 'NEW_DEVICE':
                return `
                    <div>
                        ID : 신규장비-${node.id()} <br>
                        장비명 : ${node.data('newDeviceAlias')} <br>
                        IP : ${node.data('newDevicePublicIp')} <br>
                        유형 : ${node.data('newDeviceType')} <br>
                        OS : ${node.data('newDeviceOs')} <br>
                        제조사 : ${node.data('newDeviceVendor')} <br>
                    </div>
                    `;
              case 'ICON':
                return `
                    <div>
                        ID : 아이콘-${node.id()} <br>
                    </div>
                    `;
              case 'TEXT':
                return `
                    <div>
                        ID : 아이콘-${node.id()} <br>
                    </div>
                    `;
              default:
                return `
                    <div>
                        알 수 없음<br>
                    </div>
                    `;
            }
          },
          placement: 'bottom',
          trigger: 'mouseenter',
          hideOnClick: true,
          interactive: true,
        });

        popper.show();

        node.on('mouseout', () => {
          popper.hide();
        });
      });

      return cy;
    }
  };

  // 초기화(프로젝트 아이디 컨텍스트 등록)
  useEffect(() => {
    setCurProjectId(projectId);
  }, []);

  // cytoscape-navigator 등록 및 언마운트 기능
  useEffect(() => {
    if (!!curProjectId) {
      if (!cyRef.current) {
        cyRef.current = createCyInstance();
        fetchMapData();
      }

      let nav;
      if (!navigatorInitialized) {
        nav = cyRef.current.navigator(navConfig);
        setNavigatorInitialized(true);
      }
      return () => {
        if (cyRef.current) {
          cyRef.current.destroy();
          cyRef.current = null;
          nav?.destroy();
          setNavigatorInitialized(false);
        }
      };
    }
  }, [curProjectId]);

  // 배경 이미지 수정 기능
  useEffect(() => {
    if (bgImgInfo && cyRef.current && dataReady) {
      const cy = cyRef.current;
      const bgNode = cy.getElementById('background');
      if (bgNode.data('src') !== bgImgInfo.src) {
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

      setDataReady(false);
    }
  }, [dataReady, bgImgInfo]);

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

  // 노드 전체 크기 수정
  useEffect(() => {
    if (cyRef.current && curProjectId && selectedSize) {
      if (nodes.length > 1 && nodes[1].data.nodeSize !== selectedSize) {
        updateNodeSize();
      }
      setInputSize(selectedSize);
    }
  }, [selectedSize]);

  const handleSidebarButtonClick = () => {
    setIsSidebarPanned((prevState) => !prevState);
  };

  return (
    <>
      <div className="toolbar">
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
        <button className="toolbar-button" onClick={handleSidebarButtonClick}>
          사이드바 {isSidebarPanned ? '접기' : '펼치기'}
        </button>
      </div>
      <div className="flex-div">
        <Sidebar />
        <div className="diagram-field">
          <ToolBox />
          <div
            id="cy"
            style={{
              border: '1px solid black',
            }}
          />
          <div id="navigator-container" />
        </div>
      </div>
    </>
  );
};

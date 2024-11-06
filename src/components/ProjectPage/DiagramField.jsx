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
import sizes from '../../constants/SizesOption';
import { CustomDeviceNode } from './CustomDeviceNode';
import { CustomIconNode } from './CustomIconNode';
import Combobox from '../common/Combobox';

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
    bgImg,
    updateNode,
    updateNodeSize,
    createLink,
    deleteObject,
    cyRef,
    nodes,
    edges,
    dataReady,
    setDataReady,
    setEdges,
    isLinking,
    isObjectDelete,
    setIsObjectDelete,
    selectedSize,
    setSelectedSize,
  } = useContext(NetworkContext);

  const [navigatorInitialized, setNavigatorInitialized] = useState(false); // 네비게이터 초기화 상태

  const createCyInstance = () => {
    if (!cyRef.current) {
      // cytoscape 기본 인스턴스 생성
      const cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
          {
            selector: '#background',
            style: {
              'background-image': `url(${nodes[0]?.data.src || ''})`,
              'background-fit': 'cover',
              'z-index': -1,
              width: 600,
              height: 400,
              shape: 'rectangle',
              'background-color': '#e1e1e1',
              'z-compound-depth': 'bottom',
              events: 'no',
            },
          },
          {
            selector: 'node[id != "background"][nodeSize][nodeId]',
            style: {
              width: 'data(nodeSize)',
              height: 'data(nodeSize)',
            },
          },
        ],
        layout: {
          name: 'preset',
          //   name: 'dagre',
          //   padding: 24,
          //   spacingFactor: 1.5,
        },
        autoungrabify: false,
        boxSelectionEnabled: true,
        minZoom: 0.5,
        maxZoom: 5,
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
                        장비명 : ${node.data('newDeviceAlias')} <br>
                        IP : ${node.data('newDevicePublicIp')} <br>
                        유형 : ${node.data('newDeviceType')} <br>
                        OS : ${node.data('newDeviceOs')} <br>
                        제조사 : ${node.data('newDeviceVendor')} <br>
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
          //   alert('DiagramField component is unmounting.');
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
    if (bgImg && cyRef.current && dataReady) {
      const cy = cyRef.current;
      const bgNode = cy.getElementById('background');
      bgNode.style({
        'background-image': `url(${bgImg})`,
        'background-fit': 'cover',
        events: 'no',
      });
      setDataReady(false);
    }
  }, [dataReady, bgImg]);

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

      //   cy.layout({
      //     name: 'preset',
      //   }).run();

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
    }
  }, [selectedSize]);

  return (
    <>
      <Combobox
        label="노드 크기"
        placeholder="노드 크기설정"
        items={sizes}
        onSelect={setSelectedSize}
      />
      <ToolBox />
      <div
        id="cy"
        style={{
          width: '800px',
          height: '1000px',
          border: '1px solid black',
        }}
      />
      <div className="navigator-container" />
    </>
  );
};

// 외부 라이브러리
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import edgehandles from 'cytoscape-edgehandles';
import navigator from 'cytoscape-navigator';
import cytoscapePopper from 'cytoscape-popper';
import tippy from 'tippy.js';

// 내부 컴포넌트
import EHoptions from '../../constants/EdgeHandleOptions';
import sizes from '../../constants/SizesOption';
import { useContext, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { NetworkContext } from '../../contexts/NetworkContext';
import { CustomDeviceNode } from './CustomDeviceNode';
import { CustomIconNode } from './CustomIconNode';
import { ToolBox } from './ToolBox';
import Combobox from '../common/Combobox';

import 'cytoscape-navigator/cytoscape.js-navigator.css';
import 'tippy.js/dist/tippy.css';
import './NetworkMap.css';

// 툴팁 기능을 위한 설정
function tippyFactory(ref, content) {
  const dummyDomElement = document.createElement('div');

  const tip = tippy(dummyDomElement, {
    allowHTML: true,
    appendTo: document.body,
    arrow: true,
    content: content,
    getReferenceClientRect: ref.getBoundingClientRect,
    hideOnClick: true,
    interactive: true,
    placement: 'bottom',
    trigger: 'mouseover',
  });

  return tip;
}

cytoscape.use(dagre);
cytoscape.use(edgehandles);
cytoscape.use(cytoscapePopper(tippyFactory));
nodeHtmlLabel(cytoscape);
navigator(cytoscape);

export const NetworkMap = ({ projectId }) => {
  const {
    curProjectId,
    setCurProjectId,
    fetchMapData,
    updateNode,
    createLink,
    cyRef,
    nodes,
    edges,
    setEdges,
    isLinking,
    isModalOpen,
    selectedSize,
    setSelectedSize,
  } = useContext(NetworkContext);

  useEffect(() => {
    setCurProjectId(projectId);
  }, []);

  useEffect(() => {
    if (!!curProjectId) {
      const initDraw = async () => {
        await fetchMapData();
      };
      initDraw();

      const cy = cytoscape({
        container: document.getElementById('cy'),
        // 노드 스타일 : elements의 크기를 반영하는데 필요
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
            selector: '.NEW_DEVICE',
            style: {
              width: 'data(width)',
              height: 'data(height)',
            },
          },
          {
            selector: '.NEW_DEVICE:selected',
            style: {
              width: 'data(width)',
              height: 'data(height)',
            },
          },
          {
            selector: '.ICON',
            style: {
              width: '40px',
              height: '40px',
            },
          },
          {
            selector: ':parent',
            style: {
              backgroundColor: 'white',
              opacity: 1,
            },
          },
        ],
        layout: {
          name: 'dagre',
          padding: 24,
          spacingFactor: 1.5,
        },
        elements: [...nodes, ...edges],
        autoungrabify: false,
        boxSelectionEnabled: true,
        minZoom: 0.5,
        maxZoom: 3,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        wheelSensitivity: 0.2,
      });

      const htmlLabelInstance = cy.nodeHtmlLabel([
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
          query: '.device:selected',
          halign: 'center',
          valign: 'center',
          halignBox: 'center',
          valignBox: 'center',
          tpl(data) {
            return `${ReactDOMServer.renderToString(
              <CustomDeviceNode
                node={cy.getElementById(data.id)}
                data={data}
                isSelected={true}
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
        const node = target.json();
        node.data.nodeSize = target.width();

        await updateNode(node);
      });

      // 온클릭에 노드 정보 띄우기(차후 삭제 예정)
      cy.on('select', 'node', function (event) {
        const node = event.target;
        console.log(node.width());
      });

      cy.on('mouseover', '.NEW_DEVICE', (event) => {
        const node = event.target;
        const popperRef = node.popperRef();

        const content = `
                        ID : ${node.id()} <br>
                        장비명 : ${node.data('newDeviceAlias')} <br>
                        IP : ${node.data('newDevicePublicIp')} <br>
                        유형 : ${node.data('newDeviceType')} <br>
                        OS : ${node.data('newDeviceOs')} <br>
                        제조사 : ${node.data('newDeviceVendor')} <br>
                        `;

        const tip = tippyFactory(popperRef, content);

        tip.show();
        node.on('mouseout', () => {
          tip.hide();
        });
      });

      const navConfig = {
        container: document.getElementById('navigator-container'),
        viewLiveFramerate: 0,
        thumbnailEventFramerate: 30,
        thumbnailLiveFramerate: false,
        dblClickDelay: 200,
        removeCustomContainer: true,
        rerenderDelay: 100,
      };

      const navigatorInstance = cy.navigator(navConfig);

      cyRef.current = cy;

      return () => {
        navigatorInstance.destroy();
        cy.destroy();
      };
    }
  }, [curProjectId]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().remove();
      cy.add([...nodes, ...edges]);
      cy.getElementById('background').style({
        'background-image': `url(${nodes[0]?.data.src || ''})`,
        'background-fit': 'cover',
        'z-index': -1,
        width: 600,
        height: 400,
        shape: 'rectangle',
        'background-color': '#e1e1e1',
        'z-compound-depth': 'bottom',
        events: 'no',
      });
      if (!cy.layoutInitialized) {
        cy.layout({
          name: 'preset',
        });
      }
    }
  }, [nodes, edges]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.nodes('.NEW_DEVICE').forEach((node) => {
        node.style({
          width: `${selectedSize}px`,
          height: `${selectedSize}px`,
        });
      });
    }
  }, [selectedSize]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const eh = cy.edgehandles(EHoptions);

      cy.elements().unselect(); // 링크 편집상태를 바꾸면 모든 노드 선택 초기화

      if (isLinking) {
        eh.enableDrawMode();

        cy.on('ehstart', (event, sourceNode) => {
          if (sourceNode.id() === 'background') {
            eh.stop();
          }
        });

        cy.on(
          'ehcomplete',
          async (event, sourceNode, targetNode, addedEdge) => {
            const edgeId = await createLink(
              sourceNode.json(),
              targetNode.json(),
            );
            const edge = {
              data: {
                id: 'edge-' + edgeId,
                source: sourceNode.id(),
                target: targetNode.id(),
              },
            };
            setEdges((prevEdges) => [...prevEdges, edge]);
          },
        );
      } else {
        eh.disableDrawMode();
        cy.off('ehstart');
      }

      return () => {
        eh.disableDrawMode();
        cy.off('ehstart');
      };
    }
  }, [isLinking]);

  const infoButtonOnClick = () => {
    // 노드 정보 가져오기
    const cy = cyRef.current;
    const nodesInfo = cy.nodes().map((node) => {
      return {
        id: node.id(),
        position: node.position(),
      };
    });

    // 엣지 정보 가져오기
    const edgesInfo = cy.edges().map((edge) => {
      return {
        id: edge.id(),
        source: edge.source().id(),
        target: edge.target().id(),
      };
    });

    // 콘솔에 정보 출력
    console.log('노드 상세 정보:', nodes);
    console.log('엣지 상세 정보:', edges);
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={infoButtonOnClick}>정보 출력</button>
        <Combobox
          label="노드 크기"
          placeholder="노드 크기"
          items={sizes}
          onSelect={setSelectedSize}
        />
      </div>
      <ToolBox />
      <div
        id="cy"
        style={{
          width: '800px',
          height: '600px',
          border: '1px solid lightgray',
          zIndex: '10',
        }}
      />
    </div>
  );
};

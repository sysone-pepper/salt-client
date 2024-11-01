import ReactDOMServer from 'react-dom/server';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import edgehandles from 'cytoscape-edgehandles';
import EHoptions from '../../constants/EdgeHandleOptions';
import sizes from '../../constants/SizesOption';

import { useContext, useEffect } from 'react';
import { NetworkContext } from '../../contexts/NetworkContext';
import { CustomDeviceNode } from './CustomDeviceNode';
import { CustomIconNode } from './CustomIconNode';
import { ToolBox } from './ToolBox';
import { Modal } from './Modals/Modal';
import { BackgroundNode } from './BackgroundNode';
import Combobox from '../common/Combobox';

cytoscape.use(dagre);
cytoscape.use(edgehandles);
nodeHtmlLabel(cytoscape);

export const NetworkMap = () => {
  const {
    cyRef,
    nodes,
    edges,
    isLinking,
    setIsLinking,
    isModalOpen,
    isResizable,
    isUngroupNeeded,
    setIsUngroupNeeded,
    setisResizable,
    selectedSize,
    setSelectedSize,
  } = useContext(NetworkContext);
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById('cy'),
      // 노드 스타일 : elements의 크기를 반영하는데 필요
      style: [
        {
          selector: '.device',
          style: {
            'background-opacity': 0,
            width: `${selectedSize}px`,
            height: `${selectedSize}px`,
          },
        },
        {
          selector: '.device:selected',
          style: {
            'background-opacity': 0,
            width: `${selectedSize}px`,
            height: `${selectedSize}px`,
          },
        },
        {
          selector: '.icon',
          style: {
            'background-opacity': 0,
            width: '50px',
            height: '70px',
          },
        },
      ],
      layout: {
        name: 'dagre',
        padding: 24,
        spacingFactor: 1.5,
      },
      elements: [...nodes, ...edges],
      zoomingEnabled: true,
      userZoomingEnabled: true,
      autoungrabify: false,
      boxSelectionEnabled: true, // 박스 선택 활성화
    });

    cy.nodeHtmlLabel([
      {
        query: '#background',
        halign: 'center',
        valign: 'center',
        halignBox: 'center',
        valignBox: 'center',
        cssClass: '',
        tpl(data) {
          return `${ReactDOMServer.renderToString(
            <BackgroundNode data={data} />,
          )}`;
        },
      },
      {
        query: '.device',
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
        query: '.icon',
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

    // 노드 리사이징을 하고 나면 state에 width와 height를 반영
    cy.on('nodeediting.resizeend', function (event, type, node) {
      const width = node.width();
      const height = node.height();

      node.data('width', width);
      node.data('height', height);

      setNodes(cy.elements().map((ele) => ele.json()));
    });

    // 온클릭에 노드 정보 띄우기(차후 삭제 예정)
    cy.on('select', 'node', function (event) {
      const node = event.target;
      console.log(node.width());
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().remove();
      cy.add([...nodes, ...edges]);
      cy.layout({
        name: 'dagre',
        padding: 24,
        spacingFactor: 1.5,
      }).run();
    }
  }, [nodes]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.nodes('.device').forEach((node) => {
        node.style({
          width: `${selectedSize}px`,
          height: `${selectedSize}px`,
        });
      });
    }
  }, [selectedSize]);

  useEffect(() => {
    const cy = cyRef.current;
    const eh = cy.edgehandles(EHoptions);

    cy.elements().unselect(); // 링크 편집상태를 바꾸면 모든 노드 선택 초기화

    if (isLinking) {
      eh.enableDrawMode();
      setisResizable(false);
      // 링크 편집을 활성화할 경우 디바이스 노드에 noResizeMode추가

      cy.on('ehstart', (event, sourceNode) => {
        if (sourceNode.id() === 'background') {
          eh.stop();
        }
      });
    } else {
      eh.disableDrawMode();
      setisResizable(true);

      cy.off('ehstart');
    }

    return () => {
      eh.disableDrawMode();
      cy.off('ehstart');
    };
  }, [isLinking]);

  useEffect(() => {
    const cy = cyRef.current;

    if (isResizable) {
      cy.nodes('.device').removeClass('noResizeMode');
    } else {
      cy.nodes('.device').addClass('noResizeMode');
    }
  }, [isResizable]);

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
        position: edge.position(), // 엣지는 위치가 없으므로 이 부분은 필요에 따라 수정
      };
    });

    // 콘솔에 정보 출력
    console.log('노드 정보:', nodesInfo);
    console.log('엣지 정보:', edgesInfo);
  };

  return (
    <>
      <button onClick={infoButtonOnClick}>정보 출력</button>
      <Combobox
        label="노드 크기"
        placeholder="20"
        items={sizes}
        onSelect={setSelectedSize}
      />
      {isModalOpen && <Modal />}
      <ToolBox />
      <div
        id="cy"
        style={{
          width: '800px',
          height: '1600px',
          border: '1px solid lightgray',
        }}
      />
    </>
  );
};

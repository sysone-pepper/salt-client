import ReactDOMServer from 'react-dom/server';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import edgehandles from 'cytoscape-edgehandles';
import EHoptions from '../../constants/EdgeHandleOptions';
import nodeEditing from 'cytoscape-node-editing';
import jQuery from 'jquery';
import konva from 'konva';

import { useContext, useEffect, useState } from 'react';
import { NetworkContext } from '../../contexts/NetworkContext';
import { CustomDeviceNode } from './CustomDeviceNode';
import { CustomIconNode } from './CustomIconNode';
import { ToolBox } from './ToolBox';
import { Modal } from './Modals/Modal';
import { BackgroundNode } from './BackgroundNode';

cytoscape.use(dagre);
cytoscape.use(edgehandles);
nodeHtmlLabel(cytoscape);
nodeEditing(cytoscape, jQuery, konva);

export const NetworkMap = ({ projectId }) => {
  const {
    curProjectId,
    setCurProjectId,
    fetchMapData,
    updateNode,
    createLink,
    cyRef,
    nodes,
    setNodes,
    edges,
    setEdges,
    isLinking,
    isModalOpen,
    isUngroupNeeded,
    setIsUngroupNeeded,
  } = useContext(NetworkContext);

  useEffect(() => {
    setCurProjectId(projectId);
  }, []);

  useEffect(() => {
    if (!!curProjectId) {
      fetchMapData();
    }
    const cy = cytoscape({
      container: document.getElementById('cy'),
      // 노드 스타일 : elements의 크기를 반영하는데 필요
      style: [
        {
          selector: '.device[width][height]',
          style: {
            label: 'data(id)',
            'background-opacity': 0,
            width: 'data(width)',
            height: 'data(height)',
          },
        },
        {
          selector: '.device[width][height]:selected',
          style: {
            label: 'data(id)',
            'background-opacity': 0,
            width: 'data(width)',
            height: 'data(height)',
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
    // 노드 확대축소 라이브러리
    cy.nodeEditing({
      padding: 5,
      undoable: true,
      grappleSize: 6,
      grappleColor: '#fff',
      grappleStrokeColor: '#666666',
      grappleStrokeWidth: 1,
      inactiveGrappleStroke: 'inside 1px',
      boundingRectangleLineDash: [2, 4],
      boundingRectangleLineColor: '#666666',

      isNoResizeMode: function (node) {
        return node.is('.noResizeMode');
      }, // no active grapples

      isFixedAspectRatioResizeMode: function (node) {
        return node.is('.fixedAspectRatioResizeMode');
      },
    });

    // 노드 리사이징을 하고 나면 state에 width와 height를 반영
    cy.on('nodeediting.resizeend', async function (event, type, target) {
      const width = target.width();
      target.data('width', width);
      target.data('height', width);

      const node = target.json();
      node.data.nodeSize = target.width();

      await updateNode(node);
    });

    cy.on('dragfree', 'node', async (event) => {
      const target = event.target;
      const node = target.json();
      node.data.nodeSize = target.width();

      await updateNode(node);
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [curProjectId]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().remove();
      cy.add([...nodes, ...edges]);
      if (!cy.layoutInitialized) {
        cy.layout({
          name: 'preset',
        });
      }
    }
  }, [nodes, edges]);

  useEffect(() => {
    const cy = cyRef.current;
    const eh = cy.edgehandles(EHoptions);

    if (isLinking) {
      eh.enableDrawMode();

      cy.on('ehstart', (event, sourceNode) => {
        if (sourceNode.id() === 'background') {
          eh.stop();
        }
      });

      cy.on('ehcomplete', async (event, sourceNode, targetNode, addedEdge) => {
        const edgeId = await createLink(sourceNode.json(), targetNode.json());
        const edge = {
          data: {
            id: 'edge-' + edgeId,
            source: sourceNode.id(),
            target: targetNode.id(),
          },
        };
        setEdges((prevEdges) => [...prevEdges, edge]);
      });
    } else {
      eh.disableDrawMode();
      cy.off('ehstart');
    }

    return () => {
      eh.disableDrawMode();
      cy.off('ehstart');
    };
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
    <>
      {isUngroupNeeded && <p>그룹화를 해제해주세요</p>}

      <button onClick={infoButtonOnClick}>정보 출력</button>
      {isModalOpen && <Modal />}
      <ToolBox />
      <div
        id="cy"
        style={{
          width: '800px',
          height: '600px',
          border: '1px solid lightgray',
        }}
      />
    </>
  );
};

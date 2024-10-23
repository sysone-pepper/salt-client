import ReactDOMServer from "react-dom/server";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import nodeHtmlLabel from "cytoscape-node-html-label";
import edgehandles from "cytoscape-edgehandles";
import EHoptions from "../../constants/EdgeHandleOptions";
import { useContext, useEffect } from "react";
import { NetworkContext } from "../../contexts/NetworkContext";
import { CustomDeviceNode } from "./CustomDeviceNode";
import { ToolBox } from "./ToolBox";
import { Modal } from "./Modals/Modal";
import { BackgroundNode } from "./BackgroundNode";

cytoscape.use(dagre);
cytoscape.use(edgehandles);
nodeHtmlLabel(cytoscape);

export const NetworkMap = () => {
  const { cyRef, nodes, edges, isLinking, isModalOpen } =
    useContext(NetworkContext);

  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      layout: {
        name: "dagre",
        padding: 24,
        spacingFactor: 1.5,
      },
      elements: [...nodes, ...edges],
      zoomingEnabled: true,
      userZoomingEnabled: true,
      autoungrabify: false,
    });

    cy.nodeHtmlLabel([
      {
        query: "#background",
        halign: "center",
        valign: "center",
        halignBox: "center",
        valignBox: "center",
        cssClass: "",
        tpl(data) {
          return `${ReactDOMServer.renderToString(
            <BackgroundNode data={data} />
          )}`;
        },
      },
      {
        query: ".device",
        halign: "center",
        valign: "center",
        halignBox: "center",
        valignBox: "center",
        cssClass: "",
        tpl(data) {
          return `${ReactDOMServer.renderToString(
            <CustomDeviceNode node={cy.getElementById(data.id)} data={data} />
          )}`;
        },
      },
    ]);

    // eh.enableDrawMode();
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
        name: "dagre",
        padding: 24,
        spacingFactor: 1.5,
      }).run();
    }
  }, [nodes]);
  useEffect(() => {
    const cy = cyRef.current;
    const eh = cy.edgehandles(EHoptions);

    if (isLinking) {
      eh.enableDrawMode();

      cy.on("ehstart", (event, sourceNode) => {
        if (sourceNode.id() === "background") {
          eh.stop();
        }
      });
    } else {
      eh.disableDrawMode();
      cy.off("ehstart");
    }

    return () => {
      eh.disableDrawMode();
      cy.off("ehstart");
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
        position: edge.position(), // 엣지는 위치가 없으므로 이 부분은 필요에 따라 수정
      };
    });

    // 콘솔에 정보 출력
    console.log("노드 정보:", nodesInfo);
    console.log("엣지 정보:", edgesInfo);
  };

  return (
    <>
      <button onClick={infoButtonOnClick}>정보 출력</button>
      {isModalOpen && <Modal />}
      <ToolBox />
      <div
        id="cy"
        style={{
          width: "800px",
          height: "600px",
          border: "1px solid lightgray",
        }}
      />
    </>
  );
};

import ReactDOMServer from "react-dom/server";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import nodeHtmlLabel from "cytoscape-node-html-label";
import { useContext, useEffect, useRef } from "react";
import { NetworkContext } from "../../contexts/NetworkContext";
import { CustomDeviceNode } from "./CustomDeviceNode";
import { ToolBox } from "./ToolBox";
import { Modal } from "./Modals/Modal";
import { BackgroundNode } from "./BackgroundNode";

cytoscape.use(dagre);
nodeHtmlLabel(cytoscape);

export const NetworkMap = () => {
  const { nodes, isModalOpen } = useContext(NetworkContext);
  const cyRef = useRef(null);
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      layout: {
        name: "dagre",
        padding: 24,
        spacingFactor: 1.5,
      },
      elements: nodes,
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

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().remove();
      cy.add(nodes);

      cy.layout({
        name: "dagre",
        padding: 24,
        spacingFactor: 1.5,
      }).run();
    }
  }, [nodes]);

  return (
    <>
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

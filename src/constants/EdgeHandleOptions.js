let defaults = {
  canConnect: function (sourceNode, targetNode) {
    // whether an edge can be created between source and target
    // if (sourceNode.id() === "background") return;
    if (sourceNode.id() === "background" || targetNode.id() === "background") {
      return false; // 연결을 허용하지 않음
    }
    return !sourceNode.same(targetNode); // e.g. disallow loops
  },
  edgeParams: function (sourceNode, targetNode) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {};
  },
  handleNodes: "node:not(#background)",
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
};
export default defaults;

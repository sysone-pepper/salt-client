let defaults = {
  // container: document.getElementById('navigator-container'),
  container: '.cytoscape-navigator', // string | false | undefined. Supported strings: an element id selector (like "#someId"), or a className selector (like ".someClassName"). Otherwise an element will be created by the library.
  viewLiveFramerate: 0,
  thumbnailEventFramerate: 30,
  thumbnailLiveFramerate: false,
  dblClickDelay: 200,
  removeCustomContainer: true,
  // width: 150, // 네비게이터 너비
  // height: 150, // 네비게이터 높이
  // position: 'bottom-right', // 위치 조정 옵션
};
export default defaults;

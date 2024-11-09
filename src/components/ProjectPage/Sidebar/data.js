const deviceStatus = [
  { category: 'Server', total: 7, warning: 4 },
  { category: 'Network', total: 4, warning: 0 },
  { category: 'L2Switch', total: 7, warning: 4 },
  { category: 'L3Switch', total: 7, warning: 4 },
  { category: 'L4Switch', total: 7, warning: 4 },
  { category: 'L7Switch', total: 7, warning: 4 },
  { category: 'FW', total: 1, warning: 0 },
  { category: 'UPS', total: 1, warning: 0 },
];

const topTrafficUsage = [
  {
    serverName: 'MGMT02(10.10.100.204)',
    traffic: '701.75 K',
    cpuUsagePercent: '3.85',
    memUsagePercent: '34.55',
    diskUsagePercent: '80.53',
  },
  {
    serverName: 'MGMT01(10.10.100.203)',
    traffic: '487.29 K',
    cpuUsagePercent: '0.67',
    memUsagePercent: '21.99',
    diskUsagePercent: '37.18',
  },
  {
    serverName: 'vdi node2',
    traffic: '375.71 K',
    cpuUsagePercent: '9',
    memUsagePercent: '0',
    diskUsagePercent: '100',
  },
  {
    serverName: 'vdi node1',
    traffic: '375.71 K',
    cpuUsagePercent: '9',
    memUsagePercent: '0',
    diskUsagePercent: '100',
  },
  {
    serverName: '백업용 넷앱 스토리지',
    traffic: '0.00 b',
    cpuUsagePercent: '-',
    memUsagePercent: '-',
    diskUsagePercent: '-',
  },
];

const deviceTraffic = [
  {
    serverName: 'vdi node2',
    trafficAmount: '375.71 K',
  },
  {
    serverName: 'MGMT01(10.10.100.203)',
    trafficAmount: '487.29 K',
  },
  {
    serverName: 'MGR01(10.10.100.205)',
    trafficAmount: '-',
  },
  {
    serverName: 'MGMT02(10.10.100.204)',
    trafficAmount: '701.75 K',
  },
  {
    serverName: 'MGR02(10.10.100.206)',
    trafficAmount: '-',
  },
  {
    serverName: '백업용 넷앱 스토리지',
    trafficAmount: '0.00 b',
  },
  {
    serverName: 'vdi node1',
    trafficAmount: '375.71 K',
  },
];

const tableCategory = {
  deviceStatus: {
    title: '장비 현황',
    data: deviceStatus,
    columnAliases: ['', '등록', '장애'],
  },
  topTrafficUsage: {
    title: '장비 Traffic 사용량 TOP 5',
    data: topTrafficUsage,
    columnAliases: ['서버 명', 'Traffic', 'CPU(%)', 'MEM(%)', 'DISK(%)'],
  },
  deviceTraffic: {
    title: '장비 Traffic',
    data: deviceTraffic,
    columnAliases: ['서버 명', 'Traffic'],
  },
};

export { tableCategory };

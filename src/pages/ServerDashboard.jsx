import React, { useState, useEffect } from 'react';
import './ServerDashboard.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import saltLogo from '../assets/images/salt-Logo-white-rm.png';
import { getDeviceData } from '../api/Dashboard';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const ServerDashboard = ({ deviceId, deviceAlias }) => {
  const [activeTab, setActiveTab] = useState('요약');
  const [usageData, setUsageData] = useState(null);
  const [maxValueStates, setMaxValueStates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDeviceData(deviceId, 10);
        if (data.success) {
          const sortedData = data.data.sort(
            (a, b) => new Date(a.generateTime) - new Date(b.generateTime),
          );
          setUsageData(sortedData);
        } else {
          console.error('Failed to fetch usage data');
        }
      } catch (error) {
        console.error('Error fetching usage data:', error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [deviceId]);

  const getDonutOptions = (title, value) => {
    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 250,
        width: 250,
      },
      title: {
        text: '',
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          innerSize: '80%',
          borderWidth: 1,
          borderColor: '#666',
          dataLabels: {
            enabled: false,
          },
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: title,
          data: [
            {
              y: value,
              color: {
                linearGradient: { x1: 0.5, y1: 0, x2: 0.5, y2: 1 },
                stops: [
                  [0, 'rgb(199, 113, 243)'],
                  [1, 'rgb(76, 175, 254)'],
                ],
              },
            },
            {
              y: 100 - value,
              color: '#1f2937',
            },
          ],
          center: ['50%', '50%'],
          size: '100%',
          innerSize: '80%',
        },
      ],
    };
  };

  // const getChartOptions = (tab, dataKey, yAxisTitle, useMaxValue) => {
  //   if (!usageData) return {};

  //   const averageData = usageData.map((item) => [
  //     new Date(item.generateTime).getTime(),
  //     item[dataKey],
  //   ]);

  //   const minDataKey = dataKey + 'Min';
  //   const maxDataKey = dataKey + 'Max';

  //   const minData = usageData.map((item) => [
  //     new Date(item.generateTime).getTime(),
  //     item[minDataKey],
  //   ]);

  //   const maxData = usageData.map((item) => [
  //     new Date(item.generateTime).getTime(),
  //     item[maxDataKey],
  //   ]);

  //   const allDataValues = [
  //     ...averageData.map((point) => point[1]),
  //     ...minData.map((point) => point[1]),
  //     ...maxData.map((point) => point[1]),
  //   ];
  //   const maxDataValue = Math.max(...allDataValues);

  //   let yAxisMax;
  //   if (useMaxValue) {
  //     yAxisMax = maxDataValue;
  //   } else {
  //     yAxisMax = yAxisTitle.includes('%') ? 100 : maxDataValue;
  //   }

  //   return {
  //     chart: {
  //       type: 'area',
  //       zoomType: 'x',
  //       backgroundColor: 'transparent',
  //       height: 300,
  //     },
  //     title: { text: '' },
  //     xAxis: {
  //       type: 'datetime',
  //       labels: { style: { color: '#9ca3af' } },
  //     },
  //     yAxis: {
  //       max: yAxisMax,
  //       title: {
  //         text: yAxisTitle,
  //         style: { color: '#9ca3af' },
  //       },
  //       labels: { style: { color: '#9ca3af' } },
  //     },
  //     legend: {
  //       enabled: true,
  //       itemStyle: { color: '#e5e7eb' },
  //     },
  //     credits: { enabled: false },
  //     series: [
  //       {
  //         name: 'Average',
  //         data: averageData,
  //         color: {
  //           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  //           stops: [
  //             [0, 'rgb(199, 113, 243)'],
  //             [1, 'rgb(76, 175, 254)'],
  //           ],
  //         },
  //         marker: { radius: 2 },
  //         lineWidth: 1,
  //       },
  //       {
  //         name: 'Min',
  //         data: minData,
  //         color: {
  //           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  //           stops: [
  //             [0, 'rgb(143, 68, 204)'],
  //             [1, 'rgb(43, 146, 255)'],
  //           ],
  //         },
  //         dashStyle: 'ShortDot',
  //         marker: { radius: 2 },
  //         lineWidth: 1,
  //       },
  //       {
  //         name: 'Max',
  //         data: maxData,
  //         color: {
  //           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  //           stops: [
  //             [0, 'rgb(255, 94, 171)'],
  //             [1, 'rgb(76, 175, 254)'],
  //           ],
  //         },
  //         dashStyle: 'ShortDot',
  //         marker: { radius: 2 },
  //         lineWidth: 1,
  //       },
  //     ],
  //   };
  // };

  const getChartOptions = (tab, dataKey, yAxisTitle, useMaxValue) => {
    if (!usageData) return {};

    const averageData = usageData.map((item) => [
      new Date(item.generateTime).getTime(),
      item[dataKey],
    ]);

    const minDataKey = dataKey + 'Min';
    const maxDataKey = dataKey + 'Max';

    const minData = usageData.map((item) => [
      new Date(item.generateTime).getTime(),
      item[minDataKey],
    ]);

    const maxData = usageData.map((item) => [
      new Date(item.generateTime).getTime(),
      item[maxDataKey],
    ]);

    const allDataValues = [
      ...averageData.map((point) => point[1]),
      ...minData.map((point) => point[1]),
      ...maxData.map((point) => point[1]),
    ];
    const maxDataValue = Math.max(...allDataValues);

    let yAxisMax;
    if (useMaxValue) {
      yAxisMax = maxDataValue;
    } else {
      yAxisMax = yAxisTitle.includes('%') ? 100 : maxDataValue;
    }

    return {
      chart: {
        type: 'areaspline', // 영역 그라데이션을 위해 areaspline 사용
        zoomType: 'x',
        backgroundColor: 'transparent',
        height: 300,
      },
      title: { text: '' },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#9ca3af' } },
      },
      yAxis: {
        max: yAxisMax,
        title: {
          text: yAxisTitle,
          style: { color: '#9ca3af' },
        },
        labels: { style: { color: '#9ca3af' } },
      },
      legend: {
        enabled: true,
        itemStyle: { color: '#e5e7eb' },
      },
      credits: { enabled: false },
      series: [
        {
          name: 'Average',
          data: averageData,
          type: 'line', // 평균은 라인 스타일
          color: 'rgb(50, 150, 250)', // 파란 계열
          lineWidth: 3, // 굵은 라인
          marker: {
            radius: 4,
            symbol: 'circle', // 동그란 마커
            lineWidth: 2,
            lineColor: 'rgb(50, 150, 250)',
          },
        },
        {
          name: 'Min',
          data: minData,
          type: 'areaspline', // 영역 스타일
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(100, 200, 250, 0.7)'], // 연한 파란색
              [1, 'rgba(50, 150, 250, 0.2)'], // 더 연한 파란색
            ],
          },
          marker: { enabled: false },
        },
        {
          name: 'Max',
          data: maxData,
          type: 'areaspline', // 영역 스타일
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(100, 250, 150, 0.7)'], // 연한 초록색
              [1, 'rgba(50, 200, 100, 0.2)'], // 더 연한 초록색
            ],
          },
          marker: { enabled: false },
        },
      ],
    };
  };

  const toggleMaxValue = (chartKey) => {
    setMaxValueStates((prevState) => ({
      ...prevState,
      [chartKey]: !prevState[chartKey],
    }));
  };

  const renderTabCards = () => {
    if (!usageData) return null;

    const tabConfig = {
      CPU: [
        { dataKey: 'cpuProcessor', title: 'CPU Processor 사용률 (%)' },
        { dataKey: 'cpuIdle', title: 'CPU Idle (%)' },
        { dataKey: 'cpuUser', title: 'CPU User (%)' },
        { dataKey: 'cpuSystem', title: 'CPU System (%)' },
        { dataKey: 'cpuWait', title: 'CPU Wait (%)' },
        { dataKey: 'cpuLoadAvg', title: 'CPU Load Average' },
        { dataKey: 'cpuContextSwitch', title: 'CPU Context Switch 횟수' },
        { dataKey: 'cpuSyscall', title: 'CPU Syscall 횟수' },
      ],
      Memory: [
        { dataKey: 'usedMemoryPercentage', title: 'Memory Usage (%)' },
        { dataKey: 'freeMemory', title: 'Free Memory' },
        { dataKey: 'cachedMemory', title: 'Cached Memory' },
        { dataKey: 'buffersMemory', title: 'Buffers Memory' },
        { dataKey: 'swapUsed', title: 'Swap Used' },
        { dataKey: 'swapFree', title: 'Swap Free' },
        { dataKey: 'swapUsagePercentage', title: 'Swap Usage (%)' },
        { dataKey: 'totalMemory', title: 'Total Memory' },
      ],
      DISK: [
        { dataKey: 'usedDiskPercentage', title: 'Disk Usage (%)' },
        { dataKey: 'diskReadBytesPerSec', title: 'Disk Read Bytes/sec' },
        { dataKey: 'diskWriteBytesPerSec', title: 'Disk Write Bytes/sec' },
        { dataKey: 'diskQueueLength', title: 'Disk Queue Length' },
        { dataKey: 'diskUtilization', title: 'Disk Utilization (%)' },
        { dataKey: 'diskServiceTime', title: 'Disk Service Time' },
        { dataKey: 'diskReadTime', title: 'Disk Read Time' },
        { dataKey: 'diskWriteTime', title: 'Disk Write Time' },
      ],
      NIC: [
        { dataKey: 'nicInBytesPerSec', title: 'NIC In Bytes/sec' },
        { dataKey: 'nicOutBytesPerSec', title: 'NIC Out Bytes/sec' },
        { dataKey: 'nicInPacketsPerSec', title: 'NIC In Packets/sec' },
        { dataKey: 'nicOutPacketsPerSec', title: 'NIC Out Packets/sec' },
        { dataKey: 'nicInErrors', title: 'NIC In Errors' },
        { dataKey: 'nicOutErrors', title: 'NIC Out Errors' },
        { dataKey: 'nicInDropped', title: 'NIC In Dropped' },
        { dataKey: 'nicOutDropped', title: 'NIC Out Dropped' },
      ],
    };

    const charts = tabConfig[activeTab];

    return charts.map((chart, index) => (
      <div key={index} className="card">
        <div className="card-header">
          <div className="card-title">{chart.title}</div>
          <div className="max-value-toggle">
            <label>
              <input
                type="checkbox"
                checked={maxValueStates[chart.dataKey] || false}
                onChange={() => toggleMaxValue(chart.dataKey)}
              />
              Max Value
            </label>
          </div>
        </div>
        <div className="card-value">
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartOptions(
              activeTab,
              chart.dataKey,
              chart.title,
              maxValueStates[chart.dataKey] || false,
            )}
          />
        </div>
      </div>
    ));
  };

  const renderSummaryCards = () => {
    const latestData = usageData && usageData[usageData.length - 1];

    return (
      <>
        {/* 상단 4개 카드 */}
        <div className="card">
          {/* CPU 현재 사용률 (도넛 차트) */}
          <div className="card-value">
            {latestData ? (
              <>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getDonutOptions(
                    'CPU 사용률',
                    latestData.cpuProcessor,
                  )}
                />
                <div className="donut-label">
                  <div className="donut-title">CPU</div>
                  <div className="donut-percentage">
                    {latestData.cpuProcessor}%
                  </div>
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="card">
          {/* Memory 현재 사용률 (도넛 차트) */}
          <div className="card-value">
            {latestData ? (
              <>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getDonutOptions(
                    'Memory 사용률',
                    latestData.usedMemoryPercentage,
                  )}
                />
                <div className="donut-label">
                  <div className="donut-title">Memory</div>
                  <div className="donut-percentage">
                    {latestData.usedMemoryPercentage}%
                  </div>
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="card">
          {/* Disk 현재 사용률 (도넛 차트) */}
          <div className="card-value">
            {latestData ? (
              <>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getDonutOptions(
                    'Disk 사용률',
                    latestData.usedDiskPercentage,
                  )}
                />
                <div className="donut-label">
                  <div className="donut-title">Disk</div>
                  <div className="donut-percentage">
                    {latestData.usedDiskPercentage}%
                  </div>
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="card">
          {/* NIC In 사용률 추이 */}
          <div className="card-header">
            <div className="card-title">NIC In</div>
            <div className="max-value-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={maxValueStates['NIC_IN'] || false}
                  onChange={() => toggleMaxValue('NIC_IN')}
                />
                Max Value
              </label>
            </div>
          </div>
          <div className="card-value">
            {usageData ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(
                  'NIC',
                  'nicInBytesPerSec',
                  'NIC In Bytes/sec',
                  maxValueStates['NIC_IN'] || false,
                )}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>

        {/* 하단 4개 카드 */}
        <div className="card">
          {/* CPU 사용률 추이 */}
          <div className="card-header">
            <div className="card-title">CPU 추이</div>
            <div className="max-value-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={maxValueStates['CPU'] || false}
                  onChange={() => toggleMaxValue('CPU')}
                />
                Max Value
              </label>
            </div>
          </div>
          <div className="card-value">
            {usageData ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(
                  'CPU',
                  'cpuProcessor',
                  'CPU %',
                  maxValueStates['CPU'] || false,
                )}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="card">
          {/* Memory 사용률 추이 */}
          <div className="card-header">
            <div className="card-title">Memory 추이</div>
            <div className="max-value-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={maxValueStates['Memory'] || false}
                  onChange={() => toggleMaxValue('Memory')}
                />
                Max Value
              </label>
            </div>
          </div>
          <div className="card-value">
            {usageData ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(
                  'Memory',
                  'usedMemoryPercentage',
                  'Memory %',
                  maxValueStates['Memory'] || false,
                )}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="card">
          {/* Disk 사용률 추이 */}
          <div className="card-header">
            <div className="card-title">Disk 추이</div>
            <div className="max-value-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={maxValueStates['DISK'] || false}
                  onChange={() => toggleMaxValue('DISK')}
                />
                Max Value
              </label>
            </div>
          </div>
          <div className="card-value">
            {usageData ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(
                  'DISK',
                  'usedDiskPercentage',
                  'Disk %',
                  maxValueStates['DISK'] || false,
                )}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="card">
          {/* NIC Out 사용률 추이 */}
          <div className="card-header">
            <div className="card-title">NIC Out</div>
            <div className="max-value-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={maxValueStates['NIC_OUT'] || false}
                  onChange={() => toggleMaxValue('NIC_OUT')}
                />
                Max Value
              </label>
            </div>
          </div>
          <div className="card-value">
            {usageData ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(
                  'NIC',
                  'nicOutBytesPerSec',
                  'NIC Out Bytes/sec',
                  maxValueStates['NIC_OUT'] || false,
                )}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="modal-header">
        <div className="header-content">
          <div className="logo-placeholder">
            <img src={saltLogo} alt="Salt Team Logo" className="salt-logo" />
          </div>
          <nav className="navigation">
            {['요약', 'CPU', 'Memory', 'DISK', 'NIC'].map((item) => (
              <button
                key={item}
                className={`nav-button ${activeTab === item ? 'active' : ''}`}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="welcome-section">
        <h1 className="welcome-text">
          <span>서버이름 : </span>
          <span>{deviceAlias}</span>
        </h1>
      </div>
      <div className="cards-grid">
        {activeTab === '요약' ? renderSummaryCards() : renderTabCards()}
      </div>
    </div>
  );
};

export default ServerDashboard;

// import React, { useState, useEffect } from 'react';
// import './ServerDashboard.css';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsMore from 'highcharts/highcharts-more';
// import SolidGauge from 'highcharts/modules/solid-gauge';
// import saltLogo from '../assets/images/salt-Logo-white-rm.png';
// import { getDeviceData } from '../api/Dashboard';

// HighchartsMore(Highcharts);
// SolidGauge(Highcharts);

// const ServerDashboard = ({ deviceId, deviceAlias }) => {
//   const [activeTab, setActiveTab] = useState('요약');
//   const [usageData, setUsageData] = useState(null);

//   // Max Value 상태를 각 차트별로 관리하기 위한 상태
//   const [maxValueStates, setMaxValueStates] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getDeviceData(deviceId, 10);
//         if (data.success) {
//           const sortedData = data.data.sort(
//             (a, b) => new Date(a.generateTime) - new Date(b.generateTime),
//           );
//           setUsageData(sortedData);
//         } else {
//           console.error('Failed to fetch usage data');
//         }
//       } catch (error) {
//         console.error('Error fetching usage data:', error);
//       }
//     };

//     fetchData();
//     const interval = setInterval(() => {
//       fetchData();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [deviceId]);

//   const getDonutOptions = (title, value) => {
//     return {
//       chart: {
//         type: 'pie',
//         backgroundColor: 'transparent',
//         height: 250,
//         width: 250,
//       },
//       title: {
//         text: '',
//       },
//       tooltip: {
//         enabled: false,
//       },
//       plotOptions: {
//         pie: {
//           startAngle: 0,
//           endAngle: 360,
//           innerSize: '80%',
//           borderWidth: 1,
//           borderColor: '#666',
//           dataLabels: {
//             enabled: false,
//           },
//           states: {
//             hover: {
//               enabled: false,
//             },
//           },
//         },
//       },
//       credits: {
//         enabled: false,
//       },
//       series: [
//         {
//           name: title,
//           data: [
//             {
//               y: value,
//               color: {
//                 linearGradient: { x1: 0.5, y1: 0, x2: 0.5, y2: 1 },
//                 stops: [
//                   [0, 'rgb(199, 113, 243)'],
//                   [1, 'rgb(76, 175, 254)'],
//                 ],
//               },
//             },
//             {
//               y: 100 - value,
//               color: '#1f2937',
//             },
//           ],
//           center: ['50%', '50%'],
//           size: '100%',
//           innerSize: '80%',
//         },
//       ],
//     };
//   };

//   const getChartOptions = (tab, dataKey, yAxisTitle, useMaxValue) => {
//     if (!usageData) return {};

//     const chartData = usageData.map((item) => [
//       new Date(item.generateTime).getTime(),
//       item[dataKey],
//     ]);

//     const dataValues = chartData.map((point) => point[1]);
//     const maxDataValue = Math.max(...dataValues);
//     const yAxisMax = useMaxValue ? maxDataValue : 100;

//     return {
//       chart: {
//         type: 'area',
//         zoomType: 'x',
//         backgroundColor: 'transparent',
//         height: 300,
//       },
//       title: {
//         text: '',
//       },
//       xAxis: {
//         type: 'datetime',
//         labels: { style: { color: '#9ca3af' } },
//       },
//       yAxis: {
//         max: yAxisMax,
//         title: {
//           text: yAxisTitle,
//           style: { color: '#9ca3af' },
//         },
//         labels: {
//           style: { color: '#9ca3af' },
//         },
//       },
//       plotOptions: {
//         area: {
//           stacking: null,
//         },
//       },
//       legend: {
//         enabled: false,
//       },
//       credits: {
//         enabled: false,
//       },
//       series: [
//         {
//           name: yAxisTitle,
//           data: chartData,
//           color: {
//             linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//             stops: [
//               [0, 'rgb(199, 113, 243)'],
//               [1, 'rgb(76, 175, 254)'],
//             ],
//           },
//           marker: {
//             radius: 2,
//           },
//           lineWidth: 1,
//           states: {
//             hover: {
//               lineWidth: 1,
//             },
//           },
//           threshold: null,
//         },
//       ],
//     };
//   };

//   // 각 차트마다 Max Value 상태를 토글하는 함수
//   const toggleMaxValue = (chartKey) => {
//     setMaxValueStates((prevState) => ({
//       ...prevState,
//       [chartKey]: !prevState[chartKey],
//     }));
//   };

//   // 요약 탭에서 차트 배치 설정
//   const renderSummaryCards = () => {
//     const latestData = usageData && usageData[usageData.length - 1];

//     return (
//       <>
//         {/* 상단 4개 카드 */}
//         <div className="card">
//           {/* CPU 현재 사용률 (도넛 차트) */}
//           <div className="card-value">
//             {latestData ? (
//               <>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={getDonutOptions(
//                     'CPU 사용률',
//                     latestData.cpuProcessor,
//                   )}
//                 />
//                 <div className="donut-label">
//                   <div className="donut-title">CPU</div>
//                   <div className="donut-percentage">
//                     {latestData.cpuProcessor}%
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         <div className="card">
//           {/* Memory 현재 사용률 (도넛 차트) */}
//           <div className="card-value">
//             {latestData ? (
//               <>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={getDonutOptions(
//                     'Memory 사용률',
//                     latestData.usedMemoryPercentage,
//                   )}
//                 />
//                 <div className="donut-label">
//                   <div className="donut-title">Memory</div>
//                   <div className="donut-percentage">
//                     {latestData.usedMemoryPercentage}%
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         <div className="card">
//           {/* Disk 현재 사용률 (도넛 차트) */}
//           <div className="card-value">
//             {latestData ? (
//               <>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={getDonutOptions(
//                     'Disk 사용률',
//                     latestData.usedDiskPercentage,
//                   )}
//                 />
//                 <div className="donut-label">
//                   <div className="donut-title">Disk</div>
//                   <div className="donut-percentage">
//                     {latestData.usedDiskPercentage}%
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         <div className="card">
//           {/* NIC In 사용률 추이 */}
//           <div className="card-header">
//             <div className="card-title">NIC In</div>
//             <div className="max-value-toggle">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={maxValueStates['NIC_IN'] || false}
//                   onChange={() => toggleMaxValue('NIC_IN')}
//                 />
//                 Max Value
//               </label>
//             </div>
//           </div>
//           <div className="card-value">
//             {usageData ? (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={getChartOptions(
//                   'NIC',
//                   'nicInBytesPerSec',
//                   'NIC In Bytes/sec',
//                   maxValueStates['NIC_IN'] || false,
//                 )}
//               />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         {/* 하단 4개 카드 */}
//         <div className="card">
//           {/* CPU 사용률 추이 */}
//           <div className="card-header">
//             <div className="card-title">CPU 추이</div>
//             <div className="max-value-toggle">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={maxValueStates['CPU'] || false}
//                   onChange={() => toggleMaxValue('CPU')}
//                 />
//                 Max Value
//               </label>
//             </div>
//           </div>
//           <div className="card-value">
//             {usageData ? (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={getChartOptions(
//                   'CPU',
//                   'cpuProcessor',
//                   'CPU %',
//                   maxValueStates['CPU'] || false,
//                 )}
//               />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         <div className="card">
//           {/* Memory 사용률 추이 */}
//           <div className="card-header">
//             <div className="card-title">Memory 추이</div>
//             <div className="max-value-toggle">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={maxValueStates['Memory'] || false}
//                   onChange={() => toggleMaxValue('Memory')}
//                 />
//                 Max Value
//               </label>
//             </div>
//           </div>
//           <div className="card-value">
//             {usageData ? (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={getChartOptions(
//                   'Memory',
//                   'usedMemoryPercentage',
//                   'Memory %',
//                   maxValueStates['Memory'] || false,
//                 )}
//               />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         <div className="card">
//           {/* Disk 사용률 추이 */}
//           <div className="card-header">
//             <div className="card-title">Disk 추이</div>
//             <div className="max-value-toggle">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={maxValueStates['DISK'] || false}
//                   onChange={() => toggleMaxValue('DISK')}
//                 />
//                 Max Value
//               </label>
//             </div>
//           </div>
//           <div className="card-value">
//             {usageData ? (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={getChartOptions(
//                   'DISK',
//                   'usedDiskPercentage',
//                   'Disk %',
//                   maxValueStates['DISK'] || false,
//                 )}
//               />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//         <div className="card">
//           {/* NIC Out 사용률 추이 */}
//           <div className="card-header">
//             <div className="card-title">NIC Out</div>
//             <div className="max-value-toggle">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={maxValueStates['NIC_OUT'] || false}
//                   onChange={() => toggleMaxValue('NIC_OUT')}
//                 />
//                 Max Value
//               </label>
//             </div>
//           </div>
//           <div className="card-value">
//             {usageData ? (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={getChartOptions(
//                   'NIC',
//                   'nicOutBytesPerSec',
//                   'NIC Out Bytes/sec',
//                   maxValueStates['NIC_OUT'] || false,
//                 )}
//               />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </div>
//         </div>
//       </>
//     );
//   };

//   // 각 탭에서 8개의 카드 렌더링
//   const renderTabCards = () => {
//     if (!usageData) return null;

//     const tabConfig = {
//       CPU: [
//         { dataKey: 'cpuUser', title: 'User Time' },
//         { dataKey: 'cpuSystem', title: 'System Time' },
//         { dataKey: 'cpuIdle', title: 'Idle Time' },
//         { dataKey: 'cpuWait', title: 'Wait Time' },
//         { dataKey: 'cpuLoadavg', title: 'Load Average' },
//         { dataKey: 'cpuContextSwitch', title: 'Context Switches' },
//         { dataKey: 'cpuSyscall', title: 'System Calls' },
//         { dataKey: 'cpuIrq', title: 'Interrupts' },
//       ],
//       Memory: [
//         { dataKey: 'usedMemoryPercentage', title: 'Memory Usage %' },
//         { dataKey: 'usedMemory', title: 'Used Memory' },
//         { dataKey: 'freeMemory', title: 'Free Memory' },
//         { dataKey: 'cachedMemory', title: 'Cached Memory' },
//         { dataKey: 'buffersMemory', title: 'Buffers Memory' },
//         { dataKey: 'swapUsed', title: 'Swap Used' },
//         { dataKey: 'swapFree', title: 'Swap Free' },
//         { dataKey: 'swapUsagePercentage', title: 'Swap Usage %' },
//       ],
//       DISK: [
//         { dataKey: 'usedDiskPercentage', title: 'Disk Usage %' },
//         { dataKey: 'diskReadBytesPerSec', title: 'Disk Read Bytes/sec' },
//         { dataKey: 'diskWriteBytesPerSec', title: 'Disk Write Bytes/sec' },
//         { dataKey: 'diskReadTime', title: 'Disk Read Time' },
//         { dataKey: 'diskWriteTime', title: 'Disk Write Time' },
//         { dataKey: 'diskQueueLength', title: 'Disk Queue Length' },
//         { dataKey: 'diskServiceTime', title: 'Disk Service Time' },
//         { dataKey: 'diskUtilization', title: 'Disk Utilization' },
//       ],
//       NIC: [
//         { dataKey: 'nicInBytesPerSec', title: 'NIC In Bytes/sec' },
//         { dataKey: 'nicOutBytesPerSec', title: 'NIC Out Bytes/sec' },
//         { dataKey: 'nicInPacketsPerSec', title: 'NIC In Packets/sec' },
//         { dataKey: 'nicOutPacketsPerSec', title: 'NIC Out Packets/sec' },
//         { dataKey: 'nicInErrors', title: 'NIC In Errors' },
//         { dataKey: 'nicOutErrors', title: 'NIC Out Errors' },
//         { dataKey: 'nicInDropped', title: 'NIC In Dropped' },
//         { dataKey: 'nicOutDropped', title: 'NIC Out Dropped' },
//       ],
//     };

//     const charts = tabConfig[activeTab];

//     return charts.map((chart, index) => (
//       <div key={index} className="card">
//         <div className="card-header">
//           <div className="card-title">{chart.title}</div>
//           <div className="max-value-toggle">
//             <label>
//               <input
//                 type="checkbox"
//                 checked={maxValueStates[chart.dataKey] || false}
//                 onChange={() => toggleMaxValue(chart.dataKey)}
//               />
//               Max Value
//             </label>
//           </div>
//         </div>
//         <div className="card-value">
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={getChartOptions(
//               activeTab,
//               chart.dataKey,
//               chart.title,
//               maxValueStates[chart.dataKey] || false,
//             )}
//           />
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="modal-header">
//         <div className="header-content">
//           <div className="logo-placeholder">
//             <img src={saltLogo} alt="Salt Team Logo" className="salt-logo" />
//           </div>
//           <nav className="navigation">
//             {['요약', 'CPU', 'Memory', 'DISK', 'NIC'].map((item) => (
//               <button
//                 key={item}
//                 className={`nav-button ${activeTab === item ? 'active' : ''}`}
//                 onClick={() => setActiveTab(item)}
//               >
//                 {item}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>
//       <div className="welcome-section">
//         <h1 className="welcome-text">
//           <span>서버이름 : </span>
//           <span>{deviceAlias}</span>
//         </h1>
//       </div>
//       <div className="cards-grid">
//         {activeTab === '요약' ? renderSummaryCards() : renderTabCards()}
//       </div>
//     </div>
//   );
// };

// export default ServerDashboard;

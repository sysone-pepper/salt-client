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

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      yAxisMax = yAxisTitle.includes('%') ? 100 : null;
    }

    const byteDataKeys = [
      'totalMemory',
      'usedMemory',
      'freeMemory',
      'memoryBuffers',
      'memoryCached',
      'memoryPagefault',
      'totalSwap',
      'usedSwap',
      'freeSwap',
      'nicInBytesPerSec',
      'nicOutBytesPerSec',
      'ioReadBps',
      'ioWriteBps',
      'ioTotalBps',
      'ioReadBytesTot',
      'ioWriteBytesTot',
      'inPktsPerSec',
      'outPktsPerSec',
      'inErrorPkts',
    ];

    return {
      chart: {
        type: 'areaspline',
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
        labels: {
          style: { color: '#9ca3af' },
          formatter: function () {
            if (byteDataKeys.includes(dataKey)) {
              return formatBytes(this.value);
            } else {
              return this.value;
            }
          },
        },
      },
      tooltip: {
        shared: true,
        formatter: function () {
          const date = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
          let s = `<b>${date}</b>`;
          this.points.forEach((point) => {
            let value = point.y;
            if (byteDataKeys.includes(dataKey)) {
              value = formatBytes(point.y);
            } else {
              value = point.y;
            }
            s += `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${value}</b>`;
          });
          return s;
        },
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
          type: 'line',
          color: 'rgb(50, 150, 250)',
          lineWidth: 3,
          marker: {
            radius: 4,
            symbol: 'circle',
            lineWidth: 2,
            lineColor: 'rgb(50, 150, 250)',
          },
        },
        {
          name: 'Min',
          data: minData,
          type: 'areaspline',
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(100, 200, 250, 0.7)'],
              [1, 'rgba(50, 150, 250, 0.2)'],
            ],
          },
          marker: { enabled: false },
        },
        {
          name: 'Max',
          data: maxData,
          type: 'areaspline',
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(100, 250, 150, 0.7)'],
              [1, 'rgba(50, 200, 100, 0.2)'],
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
        {
          dataKey: 'usedMemoryPercentage',
          title: 'Used Memory Percentage (%)',
        },
        { dataKey: 'totalMemory', title: 'Total Memory' },
        { dataKey: 'usedMemory', title: 'Used Memory' },
        { dataKey: 'freeMemory', title: 'Free Memory' },
        { dataKey: 'usedSwapPercentage', title: 'Used Swap Percentage (%)' },
        { dataKey: 'memoryBuffers', title: 'Memory Buffers' },
        { dataKey: 'memoryCached', title: 'Memory Cached' },
        { dataKey: 'memoryPagefault', title: 'Memory Page Faults' },
      ],
      DISK: [
        { dataKey: 'usedDiskPercentage', title: '디스크 사용률 (%)' },
        { dataKey: 'ioReadBps', title: '디스크 읽기 처리량 (Bytes/sec)' },
        { dataKey: 'ioWriteBps', title: '디스크 쓰기 처리량 (Bytes/sec)' },
        { dataKey: 'ioReadCnt', title: '디스크 읽기 작업 횟수 (IOPS)' },
        { dataKey: 'ioWriteCnt', title: '디스크 쓰기 작업 횟수 (IOPS)' },
        { dataKey: 'ioTimePercentage', title: '디스크 I/O 시간 비율 (%)' },
        { dataKey: 'ioQueueDepth', title: '디스크 I/O 대기열 깊이' },
        { dataKey: 'readAvgReqSize', title: '평균 읽기 요청 크기' },
        { dataKey: 'writeAvgReqSize', title: '평균 쓰기 요청 크기' },
      ],
      NIC: [
        { dataKey: 'nicInBytesPerSec', title: 'NIC In Bytes/sec' },
        { dataKey: 'nicOutBytesPerSec', title: 'NIC Out Bytes/sec' },
        { dataKey: 'inPktsPerSec', title: 'In Packets/sec' },
        { dataKey: 'outPktsPerSec', title: 'Out Packets/sec' },
        { dataKey: 'networkUsage', title: 'Network Usage (%)' },
        { dataKey: 'rxUsage', title: 'RX Usage (%)' },
        { dataKey: 'txUsage', title: 'TX Usage (%)' },
        { dataKey: 'inErrorPkts', title: 'In Error Packets/sec' },
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
        <div className="card">
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

        <div className="card">
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

import React, { useState, useEffect } from 'react';
import './ServerDashboard.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import saltLogo from '../assets/images/salt-Logo-white-rm.png';
import { getDeviceData } from '../api/Dashboard';
import { useParams } from 'react-router-dom';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const ServerDashboard = () => {
  const [activeTab, setActiveTab] = useState('요약');
  const [usageData, setUsageData] = useState(null);
  const { deviceId } = useParams();

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

  const getChartOptions = (tab) => {
    if (!usageData) return {};

    let chartData = [];
    let yAxisTitle = '';

    if (tab === 'CPU') {
      chartData = usageData.map((item) => [
        new Date(item.generateTime).getTime(),
        item.cpuProcessor,
      ]);
      yAxisTitle = 'CPU %';
    } else if (tab === 'Memory') {
      chartData = usageData.map((item) => [
        new Date(item.generateTime).getTime(),
        item.usedMemoryPercentage,
      ]);
      yAxisTitle = 'Memory %';
    } else if (tab === 'DISK') {
      chartData = usageData.map((item) => [
        new Date(item.generateTime).getTime(),
        item.usedDiskPercentage,
      ]);
      yAxisTitle = 'Disk %';
    } else {
      return {};
    }

    return {
      chart: {
        type: 'area',
        zoomType: 'x',
        backgroundColor: 'transparent',
        height: 400,
      },
      title: {
        text: '',
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#9ca3af' } },
      },
      yAxis: {
        max: 100,
        title: {
          text: yAxisTitle,
          style: { color: '#9ca3af' },
        },
        labels: { style: { color: '#9ca3af' } },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: yAxisTitle,
          data: chartData,
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgb(199, 113, 243)'],
              [1, 'rgb(76, 175, 254)'],
            ],
          },
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      ],
    };
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
        <div className="user-section">
          <div>현재 사용자 정보</div>
          <div>님 환영합니다.</div>
        </div>
      </div>

      <div className="welcome-section">
        <h1 className="welcome-text">
          <span>서버이름</span>
          <span>장비 상세</span>
        </h1>
      </div>

      <div className="cards-grid">
        {activeTab === '요약' ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => {
              const latestData = usageData && usageData[usageData.length - 1];
              let latestUsage = null;
              let itemType = '';

              if (index === 0) {
                itemType = 'CPU';
                latestUsage = latestData ? latestData.cpuProcessor : null;
              } else if (index === 1) {
                itemType = 'Memory';
                latestUsage = latestData
                  ? latestData.usedMemoryPercentage
                  : null;
              } else if (index === 2) {
                itemType = 'Disk';
                latestUsage = latestData ? latestData.usedDiskPercentage : null;
              }

              return (
                <div key={index} className="card">
                  <div className="card-value">
                    {latestUsage !== null ? (
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={getDonutOptions(
                          `${itemType} 사용률`,
                          latestUsage,
                        )}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                    <div className="donut-label">
                      <div className="donut-title">{itemType}</div>
                      <div className="donut-percentage">{latestUsage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="card-large">
            <div className="card-header">
              <div className="card-title">{activeTab} 사용률 추이</div>
            </div>
            <div className="card-value">
              {usageData ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getChartOptions(activeTab)}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerDashboard;

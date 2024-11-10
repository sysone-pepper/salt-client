import React, { useState, useEffect } from 'react';
import './ServerDashboard.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import saltLogo from '../assets/images/salt-Logo-white-rm.png';
import { getDeviceData } from '../api/Dashboard';
import { useParams } from 'react-router-dom';

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

  const getChartOptions = (title, yAxisTitle, dataKey) => {
    if (!usageData) return {};

    const chartData = usageData.map((item) => [
      new Date(item.generateTime).getTime(),
      item[dataKey],
    ]);

    return {
      chart: {
        zoomType: 'x',
        backgroundColor: 'transparent',
        height: 200,
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
          type: 'area',
          name: title,
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
        {Array.from({ length: 8 }).map((_, index) => {
          if (index === 0) {
            // CPU
            const latestData = usageData && usageData[usageData.length - 1];
            const latestCpuUsage = latestData ? latestData.cpuProcessor : null;

            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">CPU 사용률</div>
                </div>
                <div className="card-value">
                  {usageData ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={getChartOptions(
                        'CPU Usage',
                        'CPU %',
                        'cpuProcessor',
                      )}
                    />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
                <div className="card-subtitle">
                  {latestCpuUsage !== null
                    ? `${latestCpuUsage}%`
                    : 'Loading...'}
                </div>
              </div>
            );
          } else if (index === 1) {
            // Memory
            const latestData = usageData && usageData[usageData.length - 1];
            const latestMemoryUsage = latestData
              ? latestData.usedMemoryPercentage
              : null;

            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">Memory 사용률</div>
                </div>
                <div className="card-value">
                  {usageData ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={getChartOptions(
                        'Memory Usage',
                        'Memory %',
                        'usedMemoryPercentage',
                      )}
                    />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
                <div className="card-subtitle">
                  {latestMemoryUsage !== null
                    ? `${latestMemoryUsage}%`
                    : 'Loading...'}
                </div>
              </div>
            );
          } else if (index === 2) {
            // Disk
            const latestData = usageData && usageData[usageData.length - 1];
            const latestDiskUsage = latestData
              ? latestData.usedDiskPercentage
              : null;

            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">Disk 사용률</div>
                </div>
                <div className="card-value">
                  {usageData ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={getChartOptions(
                        'Disk Usage',
                        'Disk %',
                        'usedDiskPercentage',
                      )}
                    />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
                <div className="card-subtitle">
                  {latestDiskUsage !== null
                    ? `${latestDiskUsage}%`
                    : 'Loading...'}
                </div>
              </div>
            );
          } else {
            // 나머지 카드
            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">각각 이름 {index + 1}</div>
                </div>
                <div className="card-value">
                  <div>추후 데이터 추가 예정</div>
                </div>
                <div className="card-subtitle">부제?</div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ServerDashboard;

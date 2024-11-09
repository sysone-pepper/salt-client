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
          setUsageData(data.data);
        } else {
          console.error('Failed to fetch usage data');
        }
      } catch (error) {
        console.error('Error fetching usage data:', error);
      }
    };

    fetchData();
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
        text: title,
        align: 'left',
        style: { color: '#9ca3af' },
      },
      subtitle: {
        text: '드래그하여 확대',
        align: 'left',
        style: { color: '#9ca3af' },
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#9ca3af' } },
      },
      yAxis: {
        title: {
          text: yAxisTitle,
          style: { color: '#9ca3af' },
        },
        labels: { style: { color: '#9ca3af' } },
      },
      legend: {
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
            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">CPU Usage</div>
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
                <div className="card-subtitle">CPU 사용률 추이</div>
              </div>
            );
          } else if (index === 1) {
            // MEMORY
            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">Memory Usage</div>
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
                <div className="card-subtitle">메모리 사용률 추이</div>
              </div>
            );
          } else if (index === 2) {
            // Disk
            return (
              <div key={index} className="card">
                <div className="card-header">
                  <div className="card-title">Disk Usage</div>
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
                <div className="card-subtitle">디스크 사용률 추이</div>
              </div>
            );
          } else {
            // 나머지 카드 데이터 준비 중
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

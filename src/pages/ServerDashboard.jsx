import React, { useState } from 'react';
import './ServerDashboard.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import saltLogo from '../assets/images/salt-Logo-white-rm.png';

const ServerDashboard = () => {
  const [activeTab, setActiveTab] = useState('요약');

  // 정적 차트 데이터
  const chartData = [
    [Date.UTC(2023, 0, 1), 29.9],
    [Date.UTC(2023, 0, 2), 71.5],
    [Date.UTC(2023, 0, 3), 106.4],
    [Date.UTC(2023, 0, 6), 129.2],
    [Date.UTC(2023, 0, 7), 144.0],
    [Date.UTC(2023, 0, 8), 176.0],
    [Date.UTC(2023, 0, 9), 135.6],
    [Date.UTC(2023, 0, 10), 148.5],
    [Date.UTC(2023, 0, 11), 216.4],
  ];

  const getChartOptions = (index) => ({
    chart: {
      zooming: {
        type: 'x',
      },
      backgroundColor: 'transparent',
      height: 200,
    },
    title: {
      text: `차트 ${index + 1}`,
      align: 'left',
      style: {
        color: '#9ca3af',
      },
    },
    subtitle: {
      text: '드래그하여 확대',
      align: 'left',
      style: {
        color: '#9ca3af',
      },
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: '#9ca3af',
        },
      },
    },
    yAxis: {
      title: {
        text: '수치',
        style: {
          color: '#9ca3af',
        },
      },
      labels: {
        style: {
          color: '#9ca3af',
        },
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, 'rgb(199, 113, 243)'],
            [0.7, 'rgb(76, 175, 254)'],
          ],
        },
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    series: [
      {
        type: 'area',
        name: '데이터',
        data: chartData,
      },
    ],
  });

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

      {/* 서버정보 이름 외 기타 정보 넣을지 논의 필요 */}
      <div className="welcome-section">
        <h1 className="welcome-text">
          <span>서버이름</span>
          <span>장비 상세</span>
        </h1>
      </div>

      {/* 카드 형식이되 각 탭마다 사이즈 다르게 하는 부분 확인 필요 */}
      <div className="cards-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <div className="card-title">각각 이름 {index + 1}</div>
            </div>
            <div className="card-value">
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(index)}
              />
            </div>
            <div className="card-subtitle">부제?</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerDashboard;

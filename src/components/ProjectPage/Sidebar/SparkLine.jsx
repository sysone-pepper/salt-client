import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Sparkline = ({ data }) => {
  const options = {
    chart: {
      type: 'area', // 'line'에서 'area'로 변경하여 아래 영역을 채움
      backgroundColor: 'transparent',
      height: 20, // 원하는 높이로 조정
      width: 100, // 원하는 너비로 조정
      margin: [2, 0, 2, 0],
      style: {
        overflow: 'visible',
      },
      skipClone: true,
    },
    title: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false, // 레전드 비활성화
    },
    xAxis: {
      labels: {
        enabled: false,
      },
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      gridLineWidth: 0,
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      formatter() {
        return `<b>${this.y}</b>`;
      },
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        marker: {
          radius: 1,
        },
        fillOpacity: 0.25, // 아래 영역의 색상 투명도 조정
      },
    },
    series: [
      {
        data: data,
        color: '#007bff', // 선과 아래 영역의 색상
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Sparkline;

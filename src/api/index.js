/*
서버와 통신할 때 필요한 기본 설정
로그인 토큰을 자동으로 요청에 포함
마치 호텔의 통신 시스템 설정같은 역할
*/

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  (error) => {
    console.log(error.response.status);
    console.log(error.response.status === 400);
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 401) {
        console.log('flag1');
        alert('유효하지 않은 요청입니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
      }
    }
    return Promise.reject(error); // 에러를 다시 던짐
  },
);

export default api;

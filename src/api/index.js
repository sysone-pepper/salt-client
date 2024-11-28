import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Accept: 'application/json',

    // 추가
    'Access-Control-Allow-Origin': `http://localhost:8080`,
    'Access-Control-Allow-Credentials': 'true',
  },
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
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 401) {
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

/*
서버와 통신할 때 필요한 기본 설정
로그인 토큰을 자동으로 요청에 포함
마치 호텔의 통신 시스템 설정같은 역할
*/

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

/*
로그인 상태를 전체 앱에서 관리하는 중앙 저장소
로그인/로그아웃 함수 제공
마치 호텔의 투숙객 관리 시스템같은 역할
*/

import { createContext, useContext, useState } from "react";
import { loginUser } from "../api/Auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // 토큰 있으면 로그인된 상태
  );

  const login = async (credentials) => {
    const data = await loginUser(credentials); // API 호출
    if (data.success) {
      const token = data.data.accessToken;
      localStorage.setItem("token", token); // 토큰 저장
      setIsAuthenticated(true);
      return true;
    } else {
      throw new Error("로그인 실패");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // 토큰 저장
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

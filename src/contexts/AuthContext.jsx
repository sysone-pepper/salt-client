import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/Auth.js';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token'),
  );
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null,
  );

  const decodeToken = (token) => {
    return jwtDecode(token);
  };

  const login = async (credentials) => {
    const data = await authApi.loginUser(credentials); // API 호출
    if (data.success) {
      const token = data.data.accessToken;
      localStorage.setItem('token', token); // 토큰 저장
      setIsAuthenticated(true);
      // 로그인 시 입력한 id를 currentUser로 설정
      // 토큰 내 유저 권한 추가로 필요
      const decodedToken = decodeToken(token);
      const user = {
        username: credentials.id,
        role: decodedToken.role,
        authority: decodedToken.authority,
      };
      setCurrentUser(user);

      localStorage.setItem('currentUser', JSON.stringify(user));

      return user; // 사용자 정보 반환
    } else {
      throw new Error('로그인 실패');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // 토큰 삭제
    localStorage.removeItem('currentUser');
    setCurrentUser(null); // 사용자 정보 초기화
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

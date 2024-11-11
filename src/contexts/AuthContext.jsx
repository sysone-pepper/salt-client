import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../api/Auth.js';
import * as jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.exp * 1000 > Date.now()) {
          return true;
        } else {
          localStorage.removeItem('token');
          return false;
        }
      } catch (error) {
        localStorage.removeItem('token');
        return false;
      }
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null,
  );

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const refreshToken = data.data.refreshToken;
    if (data.success) {
      const token = data.data.accessToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);

      const user = { username: credentials.id };

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } else {
      throw new Error('로그인 실패');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
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

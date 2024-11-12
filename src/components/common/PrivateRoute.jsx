/*
로그인이 필요한 페이지 접근 시 검사
로그인되지 않은 사용자는 로그인 페이지로 이동
마치 호텔의 객실층 보안 게이트같은 역할
*/

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    alert('잘못된 접근입니다.');
    logout();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

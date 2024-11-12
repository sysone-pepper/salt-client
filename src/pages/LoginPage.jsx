import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { useEffect } from 'react';

const LoginPage = () => {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/projects`);
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate(`/projects`, { replace: true });
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default LoginPage;

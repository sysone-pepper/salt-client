import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { useEffect } from 'react';

const LoginPage = () => {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(`/projects/${currentUser.username}`, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (credentials) => {
    try {
      const user = await login(credentials);
      navigate(`/projects/${user.username}`, { replace: true });
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default LoginPage;

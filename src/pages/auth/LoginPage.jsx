import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  const { login } = useAuth(); // AuthContext에서 login 함수를 가져옴
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials); // 로그인 시도
      navigate(`/projects`); // 성공하면 projects 페이지로 이동
    } catch (error) {
      alert("로그인에 실패했습니다.");
    }
  };

  return <LoginForm onSubmit={handleLogin} />; // LoginForm 컴포넌트 표시
};

export default LoginPage;

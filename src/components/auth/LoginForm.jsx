import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = ({ onSubmit }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    onSubmit({ id, password }); // 입력된 정보를 상위 컴포넌트로 전달
  };

  return (
    <div className="login">
      <h1>SALT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="u"
          placeholder="Username"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          name="p"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-block btn-large">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

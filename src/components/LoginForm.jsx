import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = ({ setCurrentUser }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        id,
        password,
      });

      const userData = response.data;

      setCurrentUser(userData);

      navigate(`/projects/${id}`);
    } catch (error) {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
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

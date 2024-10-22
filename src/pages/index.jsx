import React from "react";
import LoginForm from "./Login/LoginForm";
import "./Login/LoginForm.css";

const LoginPage = ({ setCurrentUser }) => {
  return <LoginForm setCurrentUser={setCurrentUser} />;
};

export default LoginPage;

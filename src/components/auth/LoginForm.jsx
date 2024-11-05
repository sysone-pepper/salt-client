import React, { useState } from 'react';
import './LoginForm.css';
import ImageLogo from '../../assets/images/salt-Logo-white-rm.png';

const LoginForm = ({ onSubmit }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ id, password });
  };

  return (
    <div className="login">
      <img src={ImageLogo} alt="SALT Logo" className="logo" />
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../forms/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <LoginForm onSuccess={handleLoginSuccess} />
  );
};

export default LoginPage;
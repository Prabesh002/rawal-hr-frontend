import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../forms/RegisterForm';
import { AUTH_PAGE_ROUTES } from '../routes/authRouteConstants';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate(AUTH_PAGE_ROUTES.LOGIN);
  };

  return (
    <RegisterForm onSuccess={handleRegisterSuccess} />
  );
};

export default RegisterPage;
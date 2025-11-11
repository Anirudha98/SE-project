import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useAuthGuard = (...allowedRoles) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);

  return {
    user,
    isAuthenticated,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (...roles) => roles.includes(user?.role),
  };
};


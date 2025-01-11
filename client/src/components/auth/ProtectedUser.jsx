import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedUser = ({ children }) => {
  const navigate = useNavigate();
  const { authData } = useAuth();

  // If the user is not authenticated or is not a 'User', redirect to login page
  if (!authData.token || authData.role !== 'User') {
    navigate('/');
    return null;
  }

  return children;  // Render children if user is authenticated and has 'User' role
};

export default ProtectedUser;

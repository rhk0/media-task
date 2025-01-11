import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdmin = ({ children }) => {
  const navigate = useNavigate();
  const { authData } = useAuth();

  // If the user is not authenticated or is not an 'Admin', redirect to login page
  if (!authData.token || authData.role !== 'Admin') {
    navigate('/');
    return null;
  }

  return children;  // Render children if user is authenticated and has 'Admin' role
};

export default ProtectedAdmin;

// AdminSidebar.js
import React, { useEffect } from 'react';
import { FaTachometerAlt, FaPlusCircle, FaList, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Icons
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    // Check if the token exists in session storage
    const storedToken = sessionStorage.getItem('authToken');
    if (!storedToken) {
      // If no token found, navigate to home
      navigate('/');
    }
    
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-blue-600 p-6 text-white w-64 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="text-2xl font-semibold mb-6">Dashboard</div>
        <ul>
          <li onClick={() => navigate('/admin-dashboard')} className="flex items-center p-2 hover:bg-blue-700 cursor-pointer">
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </li>
          <li onClick={() => navigate('/product')} className="flex items-center p-2 hover:bg-blue-700 cursor-pointer">
            <FaPlusCircle className="mr-3" />
            Product
          </li>
          
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="md:hidden bg-blue-600 text-white p-2 rounded-full mb-4">
          {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
        {children}
      </div>
    </div>
  );
};

export default AdminSidebar;

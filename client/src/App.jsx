
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './components/Auth.jsx';

import ProtectedUser from './components/auth/ProtectedUser.jsx';  // Import ProtectedUser
import ProtectedAdmin from './components/auth/ProtectedAdmin.jsx'; // Import ProtectedAdmin
import { AuthProvider } from './components/context/AuthContext.jsx';
import AdminDash from './components/admin/AdminDash.jsx';
import User from './components/user/UserDash.jsx';
import Product from './components/admin/Product.jsx';

function App() {
  return (
    <AuthProvider>  {/* Wrap the app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedUser>
                <User />
              </ProtectedUser>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdmin>
                <AdminDash /> 
              </ProtectedAdmin>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedAdmin>
                <Product /> 
              </ProtectedAdmin>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

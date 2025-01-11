
// import React, { useState } from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// const Auth = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const navigate = useNavigate();  // Initialize navigate hook
//   const { login } = useAuth();  // Get login function from context

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const googleClientID = "1090623046993-0417gkehmr4s2bg1htj9k2j55bftudit.apps.googleusercontent.com";

//   const handleSignup = async () => {
//     try {
//       const { data } = await axios.post('/api/v1/auth/signup', formData);
//       toast.success(data.message);
//     } catch (error) {
//       toast.error(error.response.data.error);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const { data } = await axios.post('/api/v1/auth/login', formData);
//       toast.success(data.message);

//       // Store the token in sessionStorage and update the context
   
//       // Use the login function from the context
//       login(data.token, data.role,data.name);

//       // Redirect to /dashboard upon successful login
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.response.data.error);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const { data } = await axios.post('/api/v1/auth/google', {
//         token: credentialResponse.credential,
//       });
//       toast.success(data.message);

//       // Store the token in sessionStorage and update the context
//       sessionStorage.setItem('authToken', data.token);
//       sessionStorage.setItem('role', data.role); // Assuming role is returned with the token

//       // Use the login function from the context
//       login(data.token, data.role);

//       // Redirect to /dashboard upon successful Google login
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.response.data.error);
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={googleClientID}>
//       <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Manual Signup/Login</h2>
      
//         <div className="mb-4">
//           <input 
//             name="name" 
//             placeholder="Name" 
//             onChange={handleChange} 
//             value={formData.name} 
//             className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input 
//             name="email" 
//             placeholder="Email" 
//             onChange={handleChange} 
//             value={formData.email} 
//             className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input 
//             name="password" 
//             type="password" 
//             placeholder="Password" 
//             onChange={handleChange} 
//             value={formData.password} 
//             className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex justify-between mb-6">
//           <button 
//             onClick={handleSignup} 
//             className="w-48 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
//           >
//             Signup
//           </button>
//           <button 
//             onClick={handleLogin} 
//             className="w-48 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
//           >
//             Login
//           </button>
//         </div>

//         <h2 className="text-xl text-center text-gray-700 mb-4">Google OAuth</h2>
//         <GoogleLogin
//           onSuccess={handleGoogleSuccess}
//           onError={() => {
//             console.log('Login Failed');
//           }}
//           useOneTap
//           theme="filled_blue"
//           shape="pill"
//           size="large"
//           text="continue_with"
//         />
//       </div>
//       <Toaster />
//     </GoogleOAuthProvider>
//   );
// };

// export default Auth;
import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Assuming you're using context for authentication

const Auth = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();  // Initialize navigate hook
  const { login } = useAuth();  // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const googleClientID = "1090623046993-0417gkehmr4s2bg1htj9k2j55bftudit.apps.googleusercontent.com";

  const handleSignup = async () => {
    try {
      const { data } = await axios.post('/api/v1/auth/signup', formData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('/api/v1/auth/login', formData);
      toast.success(data.message);

      // Store the token in sessionStorage and update the context
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('role', data.role);  // Store the role in sessionStorage

      // Use the login function from the context
      login(data.token, data.role, data.name);

      // Conditional navigation based on role
      if (data.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('/api/v1/auth/google', {
        token: credentialResponse.credential,
      });
      toast.success(data.message);

      // Store the token in sessionStorage and update the context
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('role', data.role);  // Assuming role is returned with the token

      // Use the login function from the context
      login(data.token, data.role);

      // Conditional navigation based on role
      if (data.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientID}>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Manual Signup/Login</h2>
      
        <div className="mb-4">
          <input 
            name="name" 
            placeholder="Name" 
            onChange={handleChange} 
            value={formData.name} 
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            value={formData.email} 
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            value={formData.password} 
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between mb-6">
          <button 
            onClick={handleSignup} 
            className="w-48 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Signup
          </button>
          <button 
            onClick={handleLogin} 
            className="w-48 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
          >
            Login
          </button>
        </div>

        <h2 className="text-xl text-center text-gray-700 mb-4">Google OAuth</h2>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
          theme="filled_blue"
          shape="pill"
          size="large"
          text="continue_with"
        />
      </div>
      <Toaster />
    </GoogleOAuthProvider>
  );
};

export default Auth;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedUser from "./components/auth/ProtectedUser.jsx"; // Import ProtectedUser
import { AuthProvider } from "./components/context/AuthContext.jsx";
import User from "./components/user/UserDash.jsx";
import Signup from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import MediaGallery from "./components/user/MediaGallery.jsx";
import UploadForm from "./components/user/UploadForm.jsx";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap the app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedUser>
                <User />
              </ProtectedUser>
            }
          />

          <Route
            path="/mediagallery"
            element={
              <ProtectedUser>
                <MediaGallery />
              </ProtectedUser>
            }
          />

          <Route
            path="/uploadform"
            element={
              <ProtectedUser>
                <UploadForm />
              </ProtectedUser>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

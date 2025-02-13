import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDash = () => {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchMedia = async () => {
      try {
        const { data } = await axios.get("/api/media/media", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMedia(data);
      } catch (err) {
        setError("Error fetching media");
      }
    };
    fetchMedia();
  }, [token]);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = media.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <UserSidebar>
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Media Gallery</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map(({ url, filename, _id, type }) => (
            <div key={_id} className="border rounded-lg overflow-hidden shadow-md">
              {/* Check if the media is an image or video */}
              {type && type.includes("image") ? (
                <img
                  src={`http://localhost:5000${url}`}
                  className="w-full h-48 object-cover"
                />
              ) : type && type.includes("video") ? (
                <video controls className="w-full h-48">
                  <source src={`http://localhost:5000${url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="p-4 text-gray-600">Unsupported media type</p>
              )}
      
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(media.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </UserSidebar>
  );
};

export default UserDash;
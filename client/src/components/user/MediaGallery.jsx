import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSidebar from "./UserSidebar";


const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(8); // Items per page

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchMedia = async () => {
      try {
        const { data } = await axios.get("/api/media/media/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedia(data);
      } catch (err) {
        setError("Error fetching media");
      }
    };
    fetchMedia();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/media/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(media.filter((item) => item._id !== id));
    } catch (err) {
      setError("Error deleting media");
    }
  };

  // Filter media based on the filter state
  const filteredMedia = media.filter((item) => {
    if (filter === "image") {
      return item.type && item.type.includes("image");
    } else if (filter === "video") {
      return item.type && item.type.includes("video");
    }
    return true; // Return all media if no filter is applied
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedia.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <UserSidebar>

    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4"> Manage Media Gallery</h2>

      {/* Filter Buttons */}  
      <div className="mb-4">
        <button
          onClick={() => {
            setFilter("");
            setCurrentPage(1); // Reset to first page when changing filter
          }}
          className="mx-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          All
        </button>
        <button
          onClick={() => {
            setFilter("image");
            setCurrentPage(1); // Reset to first page when changing filter
          }}
          className="mx-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          Images
        </button>
        <button
          onClick={() => {
            setFilter("video");
            setCurrentPage(1); // Reset to first page when changing filter
          }}
          className="mx-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Videos
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.map(({ _id, url, filename, type }) => (
          <div key={_id} className="border rounded-lg overflow-hidden shadow-md">
            {type && type.includes("image") ? (
              <img
                src={`http://localhost:5000${url}`}
                className="w-full h-48 object-cover"
              />
            ) : type && type.includes("video") ? (
              <video controls className="w-full h-48">
                <source src={`http://localhost:5000${url}`} type="video/mp4" />
              </video>
            ) : (
              <p className="p-4 text-gray-600">Unsupported media</p>
            )}
            <div className="p-4 flex justify-between">
              <button onClick={() => handleDelete(_id)} className="text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: Math.ceil(filteredMedia.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
    </UserSidebar>

  );
};

export default MediaGallery;
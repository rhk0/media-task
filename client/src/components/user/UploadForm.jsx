import { useState, useEffect } from "react";
import axios from "axios";
import UserSidebar from "./UserSidebar";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null); // State to store the token

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken"); // Get the token from sessionStorage
    setToken(storedToken); // Store the token in the state
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/media/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setError("");
      alert("File uploaded successfully");
    } catch (err) {
      setError("Error uploading file");
    }
  };

  return (
    <UserSidebar>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Upload Media</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Upload
          </button>
        </form>
      </div>
    </UserSidebar>
  );
};

export default UploadForm;

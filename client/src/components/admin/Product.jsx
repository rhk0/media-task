import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({ name: '', price: '', description: '', category: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch all products on component mount
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await axios.get('/api/v1/product/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.products);
        toast.success(response.data.message)
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('description', productData.description);
      formData.append('category', productData.category);  // Adding category
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await axios.post('/api/v1/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(response.data.message);
      setIsModalOpen(false);
      setProductData({ name: '', price: '', description: '', category: '', image: '' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('description', productData.description);
      formData.append('category', productData.category);  // Adding category
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await axios.put(`/api/v1/product/update/${editingProduct._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(response.data.message);
      setIsModalOpen(false);
      setProductData({ name: '', price: '', description: '', category: '', image: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.delete(`/api/v1/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.message);
      fetchProducts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModalForUpdate = (product) => {
    setProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,  // Pre-fill category
      image: '' // Keep image empty for now, you can add a preview if needed
    });
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setProductData({ name: '', price: '', description: '', category: '', image: '' });
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get('/api/v1/product/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
   <AdminSidebar>
     <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Product Management</h2>
      <button
        onClick={openModalForAdd}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
      >
        Add New Product
      </button>
      <div className='overflow-x-auto'>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">S.No</th>
            <th className="py-2 px-4 border-b">Product Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Image</th> {/* Add Image Column */}
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product,index) => (
            <tr key={product._id} className='text-center'>
              <td className="py-2 px-4 border-b">{index+1}</td>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.price}</td>
              <td className="py-2 px-4 border-b">{product.category}</td>
              <td className="py-2 px-4 border-b">
                {/* Show product image */}
                <img
                  src={`/api/v1/uploads/${product.image}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => openModalForUpdate(product)} className="text-blue-600 mr-4">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Modal for Add/Update Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Update Product' : 'Add Product'}</h2>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="file"
              name="image"
              onChange={(e) => setProductData({ ...productData, image: e.target.files[0] })}
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            {/* Show selected image preview */}
            {productData.image && (
              <img
                src={URL.createObjectURL(productData.image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mb-4"
              />
            )}
            <div className="flex justify-between">
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
   </AdminSidebar>
  );
};

export default Product;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import UserSidebar from './UserSidebar';
import CartModal from './CartModal';
import { useNavigate } from 'react-router-dom';

const UserDash = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(null); // Cart initialized to null
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
 const navigate =useNavigate()
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    // Fetch Products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/product/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Initialize filtered products with all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Fetch Cart
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/v1/cart/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        setCart(response.data); // Set the cart data
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.price.toString().includes(searchQuery)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToCart = async (product) => {
    const token = sessionStorage.getItem('authToken');
    try {
      const quantity = 1; // Assuming the quantity to add is 1
      const response = await axios.post(
        '/api/v1/cart/add',
        { productId: product._id, quantity }, // Send both productId and quantity
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data); // Update the cart after adding
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const token = sessionStorage.getItem('authToken');
    try {
      const response = await axios.post(
        '/api/v1/cart/remove',
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data); // Update the cart after removal
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    const token = sessionStorage.getItem('authToken');
    try {
      const response = await axios.post(
        '/api/v1/cart/update',
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data); // Update the cart after changing quantity
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/'); // Redirect to login
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  return (
    <UserSidebar>
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, category, or price"
              className="p-2 border border-gray-300 rounded-lg w-96"
            />
            <FaSearch className="text-gray-600" />
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
            >
              Logout
            </button>
            <div className="relative ml-6">
              <button className="text-gray-600" onClick={toggleCartModal}>
                <FaShoppingCart className="text-4xl" />
              </button>
              {cart && cart.products && cart.products.length > 0 && (
                <span className="absolute top-0 right-0 text-white text-xs bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.products.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-green-50 p-6 rounded-lg shadow-md">
              <img
                src={`/api/v1/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-gray-600">{`₹ ${product.price}`}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <CartModal
        isOpen={isCartModalOpen}
        closeModal={toggleCartModal}
        cart={cart}
        setCart={setCart} 
        handleRemoveFromCart={handleRemoveFromCart}
        handleUpdateQuantity={handleUpdateQuantity} // Pass update function to CartModal
      />
    </UserSidebar>
  );
};

export default UserDash;

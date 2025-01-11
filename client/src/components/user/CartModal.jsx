
import { useState,useEffect } from "react";
import axios from "axios";
const CartModal = ({ isOpen, closeModal, cart, setCart }) => {
    const [token, setToken] = useState(null); // State to store the token
  
    useEffect(() => {
      const storedToken = sessionStorage.getItem('authToken'); // Get the token from sessionStorage
      setToken(storedToken); // Store the token in the state
    }, []);
  
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/v1/cart/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data); // Update the cart state with the latest data
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    if (!isOpen || !cart || !token) return null; // Ensure token is available before rendering
  
    const handleUpdateQuantity = async (productId, newQuantity) => {
      try {
        const response = await axios.put(
          `/api/v1/cart/update/${productId}`,
          { quantity: newQuantity },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the request headers
            }
          }
        );
       
        if (response.status === 200) {
          fetchCart(); // Refetch the cart to get the latest data
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    };
  
    const handleRemoveFromCart = async (productId) => {
      try {
        
        const response = await axios.post(
          `/api/v1/cart/remove/${productId}`,
         {}, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the request headers
            }
          }
        );
        if (response.status === 200) {
          fetchCart(); // Refetch the cart after removing an item
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Cart</h2>
            <button
              onClick={closeModal}
              className="text-gray-600 text-xl font-semibold"
            >
              X
            </button>
          </div>
  
          {/* List all products in the cart */}
          {cart.products && cart.products.length > 0 ? (
            <div className="space-y-6">
              {cart.products.map((item) => {
                const { productId, name, price, description, image, quantity } = item;
  
                return (
                  <div key={productId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`/api/v1/uploads/${image}`}
                        alt={name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                        <p className="text-sm text-gray-600">₹ {price}</p>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleUpdateQuantity(productId, quantity - 1)}
                        disabled={quantity <= 1}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full"
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(productId, quantity + 1)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(productId)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Your cart is empty!</p>
          )}
  
          {/* Cart Total */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-semibold">Total Amount:</p>
            <p className="text-xl font-semibold">₹ {cart.totalAmount}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default CartModal;
  
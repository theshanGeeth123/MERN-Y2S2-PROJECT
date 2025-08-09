import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cart/${userData.id}`);
      setCart(res.data.cart?.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity of item
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // Prevent zero/negative
    try {
      await axios.put(`http://localhost:4000/api/cart/update/${productId}`, {
        userId: userData.id,
        quantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/remove/${productId}`, {
        data: { userId: userData.id },
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchCart();
    }
  }, [userData.id]);

  // Calculate total
  const cartTotal = cart.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={`${item.productId?._id || "no-id"}-${index}`}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center"
              >
                <img
                  src={item.productId?.url}
                  alt={item.productId?.name}
                  className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.productId?.name}</h3>
                  <p className="text-gray-500">${item.productId?.price}</p>
                  <div className="flex items-center mt-2">
                    <label className="mr-2 text-sm text-gray-700">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId?._id, Number(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId?._id)}
                  className="mt-4 sm:mt-0 sm:ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-4 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Total:</h3>
            <p className="text-2xl font-semibold text-green-600">
              ${cartTotal.toFixed(2)}
            </p>
            <button
              onClick={() => navigate("/order-summary")}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              🧾 Proceed to Order Summary
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

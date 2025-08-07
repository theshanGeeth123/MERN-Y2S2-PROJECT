import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const { userData } = useContext(AppContent);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cart/${userData.id}`);
      setCart(res.data.cart.items || []);
    } catch (error) {
      console.error("Failed to load cart:", error.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(`http://localhost:4000/api/cart/update/${productId}`, {
        userId: userData.id,
        quantity,
      });
      fetchCart(); // refresh
    } catch (error) {
      console.error("Failed to update cart item:", error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/remove/${productId}`, {
        data: { userId: userData.id },
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center"
            >
              <img
                src={item.productId.url}
                alt={item.productId.name}
                className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.productId.name}</h3>
                <p className="text-gray-500">${item.productId.price}</p>
                <div className="flex items-center mt-2">
                  <label className="mr-2 text-sm text-gray-700">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId._id, Number(e.target.value))
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productId._id)}
                className="mt-4 sm:mt-0 sm:ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const { userData } = useContext(AppContent);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cart/${userData.id}`);
      const items = res.data.cart.items || [];
      setCartItems(items);

      const totalPrice = items.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      );
      setTotal(totalPrice);
    } catch (error) {
      console.error("Failed to fetch cart:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.id) {
      fetchCart();
    }
  }, [userData.id]);

  if (loading) return <p className="text-center mt-10">Loading order summary...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">🧾 Order Summary</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.productId.price}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xl font-bold mb-6">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              💳 Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;

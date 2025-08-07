import React, { useState, useEffect, useContext } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { userData } = useContext(AppContent);
  const [total, setTotal] = useState(0);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/cart/${userData.id}`);
        const items = res.data.cart.items || [];
        const totalPrice = items.reduce(
          (acc, item) => acc + item.productId.price * item.quantity,
          0
        );
        setTotal(totalPrice);
      } catch (err) {
        console.error("Fetch cart error:", err.message);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Simple mock validation
    if (!card.number || !card.expiry || !card.cvv) {
      setError("All fields are required.");
      return;
    }

    // Simulated payment delay
    setError("");
    setTimeout(() => {
      navigate("/payment-success");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-100 p-4">
      <form
        onSubmit={handlePayment}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">💳 Checkout</h2>

        <p className="text-center text-lg text-gray-700 font-semibold">
          Total: <span className="text-green-600">${total.toFixed(2)}</span>
        </p>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="number"
          placeholder="Card Number"
          value={card.number}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={card.expiry}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={card.cvv}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          ✅ Pay Now
        </button>
      </form>
    </div>
  );
};

export default Checkout;

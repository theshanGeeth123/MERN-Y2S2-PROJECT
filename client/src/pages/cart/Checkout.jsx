import React, { useState, useEffect, useContext } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // saved cards
  const [savedCards, setSavedCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);

  // payment form state
  const [type, setType] = useState("VISA");
  const [card, setCard] = useState({
    number: "",
    month: "",
    year: "",
    cvv: "",
  });

  const fetchCartTotal = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cart/${userData.id}`);
      const items = res.data.cart.items || [];
      const totalPrice = items.reduce(
        (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
        0
      );
      setTotal(totalPrice);
    } catch (err) {
      console.error("Fetch cart error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCards = async () => {
    if (!userData?.id) return;
    try {
      const res = await axios.get("http://localhost:4000/api/cards", {
        params: { userId: userData.id },
      });
      setSavedCards(res.data.cards || []);
    } catch (err) {
      console.error("Fetch saved cards error:", err?.response?.data || err.message);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    if (userData.id) {
      fetchCartTotal();
      fetchSavedCards();
    }
  }, [userData.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseSavedCard = async (cardId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cards/${cardId}`, {
        params: { userId: userData.id },
      });
      if (res.data?.success && res.data.card) {
        const c = res.data.card; // { type, cardNumber, expMonth, expYear }
        setType(c.type);
        setCard({
          number: c.cardNumber,
          month: String(c.expMonth).padStart(2, "0"),
          year: String(c.expYear),
          cvv: "", // user still types CVV
        });
      }
    } catch (err) {
      console.error("Get card error:", err?.response?.data || err.message);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!card.number || !card.month || !card.year || !card.cvv) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/orders/place");
      navigate("/payment-success");
    } catch (err) {
      setError("Payment failed or order could not be placed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading checkout...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-100 p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Saved Cards */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Saved Cards</h3>
            <button
              onClick={() => navigate("/cards")}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Manage Cards
            </button>
          </div>

          {loadingCards ? (
            <p className="text-gray-500">Loading saved cards…</p>
          ) : savedCards.length === 0 ? (
            <p className="text-gray-500">No saved cards. Add one from “Manage Cards”.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedCards.map((c) => (
                <div key={c._id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">{c.type} • {c.maskedCardNumber}</div>
                    <div className="text-xs text-gray-500">
                      Exp: {String(c.expMonth).padStart(2, "0")}/{c.expYear}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseSavedCard(c._id)}
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <form
          onSubmit={handlePayment}
          className="bg-white p-8 rounded-xl shadow-lg w-full space-y-5"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">💳 Checkout</h2>

          <p className="text-center text-lg text-gray-700 font-semibold">
            Total: <span className="text-green-600">${total.toFixed(2)}</span>
          </p>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Type / Brand */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Card Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded-lg"
            >
              <option>VISA</option>
              <option>MASTERCARD</option>
              <option>AMEX</option>
              <option>DISCOVER</option>
              <option>OTHER</option>
            </select>
          </div>

          <input
            type="text"
            name="number"
            placeholder="Card Number"
            value={card.number}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
          />

          <div className="flex gap-4">
            <input
              type="text"
              name="month"
              placeholder="MM"
              value={card.month}
              onChange={handleInputChange}
              className="w-1/2 border p-2 rounded-lg"
              maxLength={2}
            />
            <input
              type="text"
              name="year"
              placeholder="YYYY"
              value={card.year}
              onChange={handleInputChange}
              className="w-1/2 border p-2 rounded-lg"
              maxLength={4}
            />
          </div>

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
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect, useContext } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaLock, FaChevronLeft, FaPlus, FaCheck } from "react-icons/fa";

const Checkout = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [savedCards, setSavedCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  const [type, setType] = useState("VISA");
  const [card, setCard] = useState({
    number: "",
    month: "",
    year: "",
    cvv: "",
    name: "",
  });

  const [saveCard, setSaveCard] = useState(false);

  const fetchCartDetails = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const calculatedSubtotal = storedCart.reduce(
      (acc, item) => acc + (item.price || 0) * item.quantity,
      0
    );
    const calculatedTax = calculatedSubtotal * 0.08;
    const calculatedShipping = calculatedSubtotal > 0 ? 5.99 : 0;
    const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setShipping(calculatedShipping);
    setTotal(calculatedTotal);
    setLoading(false);
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
    fetchCartDetails();
    fetchSavedCards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      // Format card number with spaces every 4 digits
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setCard((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "month") {
      // Limit to 2 digits and ensure valid month
      let monthValue = value.replace(/\D/g, "").slice(0, 2);
      if (monthValue && parseInt(monthValue) > 12) monthValue = "12";
      setCard((prev) => ({ ...prev, [name]: monthValue }));
      return;
    }

    if (name === "year") {
      // Limit to 4 digits
      let yearValue = value.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, [name]: yearValue }));
      return;
    }

    if (name === "cvv") {
      // Limit to 3-4 digits based on card type
      const maxLength = type === "AMEX" ? 4 : 3;
      let cvvValue = value.replace(/\D/g, "").slice(0, maxLength);
      setCard((prev) => ({ ...prev, [name]: cvvValue }));
      return;
    }

    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseSavedCard = async (cardId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cards/${cardId}`, {
        params: { userId: userData.id },
      });
      if (res.data?.success && res.data.card) {
        const c = res.data.card;
        setSelectedCard(cardId);
        setType(c.type);
        setCard({
          number: c.cardNumber,
          month: String(c.expMonth).padStart(2, "0"),
          year: String(c.expYear),
          cvv: "",
          name: c.name || "",
        });
        setSuccess("Card details loaded successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Get card error:", err?.response?.data || err.message);
      setError("Failed to load card details");
      setTimeout(() => setError(""), 3000);
    }
  };

const handlePayment = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartItems.length === 0) {
    setError("Your cart is empty");
    return;
  }

  try {
    setLoading(true);

    const orderPayload = {
      userId: userData?.id,
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      total: total,
    };

    await axios.post("http://localhost:4000/api/orders/place", orderPayload);

    localStorage.removeItem("cart");
    navigate("/payment-success");
  } catch (err) {
    console.error("Order placement failed:", err.response?.data || err.message);
    setError("Payment failed or order could not be placed");
    setTimeout(() => setError(""), 5000);
  } finally {
    setLoading(false);
  }
};



  const getCardIcon = (cardType) => {
    switch (cardType) {
      case "VISA": return "/icons/visa.png";
      case "MASTERCARD": return "/icons/mastercard.png";
      case "AMEX": return "/icons/amex.png";
      case "DISCOVER": return "/icons/discover.png";
      default: return "/icons/credit-card.png";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaChevronLeft className="mr-2" /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Payment Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Saved Cards */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Saved Payment Methods</h3>
                  <button
                    onClick={() => navigate("/cards")}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <FaPlus className="mr-1" /> Add New Card
                  </button>
                </div>

                {loadingCards ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : savedCards.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No saved payment methods</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedCards.map((c) => (
                      <div
                        key={c._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedCard === c._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleUseSavedCard(c._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={getCardIcon(c.type)}
                              alt={c.type}
                              className="h-8 w-12 object-contain mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                •••• {c.maskedCardNumber}
                              </div>
                              <div className="text-xs text-gray-500">
                                Exp: {String(c.expMonth).padStart(2, "0")}/{c.expYear}
                              </div>
                            </div>
                          </div>
                          {selectedCard === c._id && (
                            <div className="bg-blue-500 rounded-full p-1">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or enter card details</span>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="VISA">Visa</option>
                    <option value="MASTERCARD">Mastercard</option>
                    <option value="AMEX">American Express</option>
                    <option value="DISCOVER">Discover</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name on card"
                    value={card.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="number"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="month"
                        placeholder="MM"
                        value={card.month}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        required
                      />
                      <input
                        type="text"
                        name="year"
                        placeholder="YYYY"
                        value={card.year}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder={type === "AMEX" ? "4 digits" : "3 digits"}
                      value={card.cvv}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="save-card"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="save-card" className="ml-2 text-sm text-gray-700">
                    Save this card for future purchases
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <FaLock className="mr-2" />
                  {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </button>

                <div className="text-xs text-center text-gray-500 mt-2">
                  <FaLock className="inline mr-1" />
                  Your payment details are secure and encrypted
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Free Returns</h3>
                <p className="text-sm text-blue-600">
                  Enjoy free returns within 30 days of purchase. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
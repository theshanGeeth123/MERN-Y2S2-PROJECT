// client/src/pages/payments/ManageCards.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaEdit, FaTrash, FaPlus, FaArrowLeft, FaCheck } from "react-icons/fa";

// ✅ Local card-type images (exact file names from your folder)
import visaIcon from "./card_type_images/visa.png";
import masterIcon from "./card_type_images/Master.png";
import amexIcon from "./card_type_images/AmericanExpress.png";
import discoverIcon from "./card_type_images/Discover.png";
import otherIcon from "./card_type_images/Other.png";

const ManageCards = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "VISA",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    name: "",
  });

  const [editingCard, setEditingCard] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "VISA",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    name: "",
  });

  // --- API calls ---
  const fetchCards = async () => {
    if (!userData?.id) return;
    try {
      const res = await axios.get("http://localhost:4000/api/cards", {
        params: { userId: userData.id },
      });
      setCards(res.data.cards || []);
    } catch (err) {
      console.error("Fetch cards error:", err?.response?.data || err.message);
      toast.error("Failed to load saved cards");
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (e) => {
    e.preventDefault();
    if (!userData?.id) return toast.error("Please login first");
    try {
      await axios.post("http://localhost:4000/api/cards", {
        userId: userData.id,
        type: form.type,
        cardNumber: form.cardNumber.replace(/\s/g, ""),
        expMonth: Number(form.expMonth),
        expYear: Number(form.expYear),
        name: form.name,
      });
      toast.success("Card saved successfully");
      setForm({ type: "VISA", cardNumber: "", expMonth: "", expYear: "", name: "" });
      fetchCards();
    } catch (err) {
      console.error("Add card error:", err?.response?.data || err.message);
      toast.error("Failed to save card");
    }
  };

  const deleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/cards/${id}`);
      toast.success("Card deleted successfully");
      fetchCards();
    } catch (err) {
      console.error("Delete card error:", err?.response?.data || err.message);
      toast.error("Failed to delete card");
    }
  };

  const openEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/cards/${id}`, {
        params: { userId: userData.id },
      });
      if (res.data?.success && res.data.card) {
        const c = res.data.card;
        setEditingCard({ _id: c._id });
        setEditForm({
          type: c.type || "VISA",
          cardNumber: c.cardNumber || "",
          expMonth: String(c.expMonth || ""),
          expYear: String(c.expYear || ""),
          name: c.name || "",
        });
      }
    } catch (err) {
      console.error("Open edit error:", err?.response?.data || err.message);
      toast.error("Could not load card details");
    }
  };

  const updateCard = async (e) => {
    e.preventDefault();
    if (!editingCard?._id) return;
    try {
      await axios.put(`http://localhost:4000/api/cards/${editingCard._id}`, {
        type: editForm.type,
        cardNumber: editForm.cardNumber.replace(/\s/g, ""),
        expMonth: Number(editForm.expMonth),
        expYear: Number(editForm.expYear),
        name: editForm.name,
      });
      toast.success("Card updated successfully");
      setEditingCard(null);
      fetchCards();
    } catch (err) {
      console.error("Update card error:", err?.response?.data || err.message);
      toast.error("Failed to update card");
    }
  };

  // --- Helpers ---
  const handleCardNumberChange = (e, isEditForm = false) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
    if (isEditForm) {
      setEditForm((prev) => ({ ...prev, cardNumber: formattedValue }));
    } else {
      setForm((prev) => ({ ...prev, cardNumber: formattedValue }));
    }
  };

  const getCardIcon = (cardType = "") => {
    const t = String(cardType).trim().toUpperCase();
    if (t === "VISA") return visaIcon;
    if (t === "MASTERCARD" || t === "MASTER CARD" || t === "MASTER") return masterIcon;
    if (t === "AMEX" || t === "AMERICAN EXPRESS" || t === "AMERICANEXPRESS") return amexIcon;
    if (t === "DISCOVER") return discoverIcon;
    return otherIcon;
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FaArrowLeft className="mr-2" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          </div>
          {/* <button
            onClick={() => navigate("/checkout")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Checkout
          </button> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Card Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FaPlus className="mr-2 text-blue-500" /> Add New Card
            </h2>
            <form onSubmit={addCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={(e) => handleCardNumberChange(e, false)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Month</label>
                  <input
                    type="number"
                    value={form.expMonth}
                    onChange={(e) => setForm({ ...form, expMonth: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Year</label>
                  <input
                    type="number"
                    value={form.expYear}
                    onChange={(e) => setForm({ ...form, expYear: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="YYYY"
                    min={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-2"
              >
                Save Card
              </button>
            </form>
          </div>

          {/* Saved Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FaCreditCard className="mr-2 text-blue-500" /> Saved Cards
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                  <FaCreditCard className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-500">No saved payment methods</p>
                <p className="text-sm text-gray-400 mt-1">Add a card to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={getCardIcon(card.type)}
                          alt={card.type}
                          className="h-8 w-12 object-contain mr-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {card.name || "Cardholder Name"}
                          </div>
                          <div className="text-sm text-gray-500">
                            •••• {card.maskedCardNumber} • Exp:{" "}
                            {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(card._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit card"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => deleteCard(card._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete card"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Card Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Card Details</h3>
            </div>

            <form onSubmit={updateCard} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
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
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={editForm.cardNumber}
                  onChange={(e) => handleCardNumberChange(e, true)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Month</label>
                  <input
                    type="number"
                    value={editForm.expMonth}
                    onChange={(e) => setEditForm({ ...editForm, expMonth: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Year</label>
                  <input
                    type="number"
                    value={editForm.expYear}
                    onChange={(e) => setEditForm({ ...editForm, expYear: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  <FaCheck className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCards;

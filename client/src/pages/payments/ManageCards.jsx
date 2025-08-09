import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageCards = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [editingCard, setEditingCard] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "VISA",
    cardNumber: "",
    expMonth: "",
    expYear: "",
  });

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

  const [form, setForm] = useState({
    type: "VISA",
    cardNumber: "",
    expMonth: "",
    expYear: "",
  });

  const addCard = async (e) => {
    e.preventDefault();
    if (!userData?.id) return toast.error("Please login first");
    try {
      await axios.post("http://localhost:4000/api/cards", {
        userId: userData.id,
        type: form.type,
        cardNumber: form.cardNumber,
        expMonth: Number(form.expMonth),
        expYear: Number(form.expYear),
      });
      toast.success("Card saved");
      setForm({ type: "VISA", cardNumber: "", expMonth: "", expYear: "" });
      fetchCards();
    } catch (err) {
      console.error("Add card error:", err?.response?.data || err.message);
      toast.error("Failed to save card");
    }
  };

  const deleteCard = async (id) => {
    if (!confirm("Delete this saved card?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/cards/${id}`);
      toast.success("Card deleted");
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
        cardNumber: editForm.cardNumber,
        expMonth: Number(editForm.expMonth),
        expYear: Number(editForm.expYear),
      });
      toast.success("Card updated");
      setEditingCard(null);
      fetchCards();
    } catch (err) {
      console.error("Update card error:", err?.response?.data || err.message);
      toast.error("Failed to update card");
    }
  };

  useEffect(() => { fetchCards(); }, [userData?.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
      
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">💳 Manage Saved Cards</h2>
          <button
            onClick={() => navigate("/checkout")}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Go to Checkout
          </button>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Add a Card</h3>
          <form onSubmit={addCard} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option>VISA</option>
                <option>MASTERCARD</option>
                <option>AMEX</option>
                <option>DISCOVER</option>
                <option>OTHER</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm text-gray-700">Card Number</span>
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="4111111111111111"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Exp. Month</span>
              <input
                type="number"
                value={form.expMonth}
                onChange={(e) => setForm({ ...form, expMonth: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="MM"
                min="1"
                max="12"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Exp. Year</span>
              <input
                type="number"
                value={form.expYear}
                onChange={(e) => setForm({ ...form, expYear: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="YYYY"
                required
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Saved Cards</h3>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : cards.length === 0 ? (
            <p className="text-gray-500">No saved cards.</p>
          ) : (
            <div className="space-y-3">
              {cards.map((c) => (
                <div key={c._id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">{c.type} • {c.maskedCardNumber}</div>
                    <div className="text-xs text-gray-500">
                      Exp: {String(c.expMonth).padStart(2, "0")}/{c.expYear}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(c._id)}
                      className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCard(c._id)}
                      className="px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

 
      {editingCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={updateCard}
            className="bg-white w-full max-w-lg p-6 rounded-xl shadow space-y-4"
          >
            <h4 className="text-xl font-semibold">Edit Card</h4>

            <label className="block">
              <span className="text-sm text-gray-700">Type</span>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option>VISA</option>
                <option>MASTERCARD</option>
                <option>AMEX</option>
                <option>DISCOVER</option>
                <option>OTHER</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Card Number</span>
              <input
                type="text"
                value={editForm.cardNumber}
                onChange={(e) => setEditForm({ ...editForm, cardNumber: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Exp. Month</span>
                <input
                  type="number"
                  value={editForm.expMonth}
                  onChange={(e) => setEditForm({ ...editForm, expMonth: e.target.value })}
                  className="w-full border rounded px-3 py-2 mt-1"
                  min="1"
                  max="12"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Exp. Year</span>
                <input
                  type="number"
                  value={editForm.expYear}
                  onChange={(e) => setEditForm({ ...editForm, expYear: e.target.value })}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageCards;

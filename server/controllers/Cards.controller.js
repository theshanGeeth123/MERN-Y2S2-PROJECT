import SavedCard from "../models/SavedCard.model.js";

// ----------------- Add New Card -----------------
export const addCard = async (req, res) => {
  try {
    const { userId, type, cardNumber, expMonth, expYear, name } = req.body;

    if (!userId || !type || !cardNumber || !expMonth || !expYear || !name) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const doc = await SavedCard.create({
      userId,
      type,
      cardNumber,
      expMonth,
      expYear,
      name,
    });

    return res.status(201).json({
      success: true,
      card: {
        _id: doc._id,
        userId: doc.userId,
        type: doc.type,
        cardNumber: doc.cardNumber, // full number
        expMonth: doc.expMonth,
        expYear: doc.expYear,
        name: doc.name,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("addCard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- List Cards -----------------
export const listCards = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const cards = await SavedCard.find({ userId }).sort({ createdAt: -1 });

    const result = cards.map((c) => ({
      _id: c._id,
      userId: c.userId,
      type: c.type,
      cardNumber: c.cardNumber, // full number
      expMonth: c.expMonth,
      expYear: c.expYear,
      name: c.name,
      createdAt: c.createdAt,
    }));

    return res.json({ success: true, cards: result });
  } catch (err) {
    console.error("listCards error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- Get One Card (for prefill) -----------------
export const getCardForPrefill = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const card = await SavedCard.findOne({ _id: id, userId });
    if (!card) return res.status(404).json({ success: false, message: "Card not found" });

    return res.json({
      success: true,
      card: {
        _id: card._id,
        userId: card.userId,
        type: card.type,
        cardNumber: card.cardNumber,
        expMonth: card.expMonth,
        expYear: card.expYear,
        name: card.name,
        createdAt: card.createdAt,
      },
    });
  } catch (err) {
    console.error("getCardForPrefill error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- Delete Card -----------------
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const del = await SavedCard.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ success: false, message: "Card not found" });

    return res.json({ success: true, message: "Card deleted successfully" });
  } catch (err) {
    console.error("deleteCard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- Update Card -----------------
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, cardNumber, expMonth, expYear, name } = req.body;

    const update = {};
    if (type !== undefined) update.type = type;
    if (cardNumber !== undefined) update.cardNumber = cardNumber;
    if (expMonth !== undefined) update.expMonth = expMonth;
    if (expYear !== undefined) update.expYear = expYear;
    if (name !== undefined) update.name = name;

    const doc = await SavedCard.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: "Card not found" });

    return res.json({
      success: true,
      card: {
        _id: doc._id,
        userId: doc.userId,
        type: doc.type,
        cardNumber: doc.cardNumber,
        expMonth: doc.expMonth,
        expYear: doc.expYear,
        name: doc.name,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    console.error("updateCard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

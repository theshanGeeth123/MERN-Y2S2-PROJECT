import SavedCard from "../models/SavedCard.model.js";


const maskCard = (num = "") => {
  const s = String(num).replace(/\s+/g, "");
  const keep = s.slice(-3);
  return `${"*".repeat(Math.max(0, s.length - 3))}${keep}`;
};


export const addCard = async (req, res) => {
  try {
    const { userId, type, cardNumber, expMonth, expYear } = req.body;

    if (!userId || !type || !cardNumber || !expMonth || !expYear) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const doc = await SavedCard.create({
      userId,
      type,
      cardNumber,
      expMonth,
      expYear,
    });

    return res.status(201).json({
      success: true,
      card: {
        _id: doc._id,
        userId: doc.userId,
        type: doc.type,
        maskedCardNumber: maskCard(doc.cardNumber),
        expMonth: doc.expMonth,
        expYear: doc.expYear,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("addCard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const listCards = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const cards = await SavedCard.find({ userId }).sort({ createdAt: -1 });
    const result = cards.map((c) => ({
      _id: c._id,
      userId: c.userId,
      type: c.type,
      maskedCardNumber: maskCard(c.cardNumber),
      expMonth: c.expMonth,
      expYear: c.expYear,
      createdAt: c.createdAt,
    }));

    return res.json({ success: true, cards: result });
  } catch (err) {
    console.error("listCards error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

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
        createdAt: card.createdAt,
      },
    });
  } catch (err) {
    console.error("getCardForPrefill error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const del = await SavedCard.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ success: false, message: "Card not found" });

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteCard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, cardNumber, expMonth, expYear } = req.body;

    const update = {};
    if (type !== undefined) update.type = type;
    if (cardNumber !== undefined) update.cardNumber = cardNumber;
    if (expMonth !== undefined) update.expMonth = expMonth;
    if (expYear !== undefined) update.expYear = expYear;

    const doc = await SavedCard.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: "Card not found" });

   
    const maskCard = (num = "") => {
      const s = String(num).replace(/\s+/g, "");
      const keep = s.slice(-3);
      return `${"*".repeat(Math.max(0, s.length - 3))}${keep}`;
    };

    return res.json({
      success: true,
      card: {
        _id: doc._id,
        userId: doc.userId,
        type: doc.type,
        maskedCardNumber: maskCard(doc.cardNumber),
        expMonth: doc.expMonth,
        expYear: doc.expYear,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    console.error("updateCard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

import Staff from "../models/Staff.model.js";
import bcrypt from "bcryptjs";

// ➕ Create staff
export const createStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, imageUrl, phone, address, dateOfBirth } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      imageUrl,
      phone,
      address,
      dateOfBirth,
    });

    res.status(201).json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Get single staff by ID
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update staff
export const updateStaff = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });

    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

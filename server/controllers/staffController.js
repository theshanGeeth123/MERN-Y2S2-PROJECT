import Staff from "../models/Staff.model.js";
import bcrypt from "bcryptjs";

// Staff Login
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!staff.isActive) {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Exclude password from response
    const { password: pwd, __v, ...staffData } = staff.toObject();

    return res.json({
      success: true,
      message: "Login successful",
      staff: staffData,
    });
  } catch (err) {
    console.error("staffLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Staff Logout (dummy since no JWT)
export const staffLogout = (req, res) => {
  return res.json({ success: true, message: "Logged out" });
};

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


export const getStaffByEmail = async (req, res) => {
  try {
    const { email } = req.body; // safer than query for PII
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const staff = await Staff.findOne({ email }).lean();
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    // never send password
    const { password, __v, ...safe } = staff;
    return res.json({ success: true, data: safe });
  } catch (err) {
    console.error("getStaffByEmail error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
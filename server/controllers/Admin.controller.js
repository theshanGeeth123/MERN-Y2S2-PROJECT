import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";

// Admin Registration
export const adminRegister = async (req, res) => {
  try {
    const { admin_id, fullName, email, role, phoneNumber, password } = req.body;

    if (!admin_id || !fullName || !email || !role || !phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    // Check for existing admin by email or admin_id
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { admin_id }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin with given email or admin_id already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      admin_id,
      fullName,
      email,
      role,
      phoneNumber,
      password: hashedPassword
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin_id,
        fullName,
        email,
        role,
        phoneNumber
      }
    });
  } catch (error) {
    console.error("Error in adminRegister:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin_id: admin.admin_id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        phoneNumber: admin.phoneNumber,
        id: admin._id
      }
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

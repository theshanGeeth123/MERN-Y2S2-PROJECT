import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    url: "",
    category: "",
    stock: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic field validation
    if (!formData.name || !formData.description || !formData.price || !formData.url) {
      return setError("Please fill all required fields.");
    }

    try {
      const res = await axios.post("http://localhost:4000/api/product", {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });

      setSuccess(true);
      setError("");
      setFormData({
        name: "",
        description: "",
        price: "",
        url: "",
        category: "",
        stock: "",
      });

      setTimeout(() => navigate("/admin/home"), 1500); // redirect after success
    } catch (err) {
      console.error("Add product error:", err.message);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Add New Product</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Product added successfully ✅</p>}

        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="url"
          placeholder="Image URL"
          value={formData.url}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="category"
          placeholder="Category (optional)"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock (optional)"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
        >
          ➕ Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

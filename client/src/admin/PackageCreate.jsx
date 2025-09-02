import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/packages`
  : "http://localhost:4000/api/packages";

function PackageCreate() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    features: ""
  });

  const validators = {
    title: val => {
      if (!val.trim()) return "Title cannot be empty.";
      if (val.length < 5) return "Title must be at least 5 characters.";
      return "";
    },
    description: val => {
      if (!val.trim()) return "Description cannot be empty.";
      if (val.length < 20) return "Description must be at least 20 characters.";
      return "";
    },
    price: val => {
      const n = Number(val);
      if (!val.trim() || isNaN(n)) return "Price must be a number.";
      if (n < 10000) return "Price should not be less than Rs.10,000.";
      if (n > 100000) return "Price cannot exceed Rs.100,000.";
      return "";
    },
    duration: val => {
      const n = Number(val);
      if (!val.trim() || isNaN(n)) return "Duration must be a number.";
      if (n <= 0) return "Duration cannot be 0 or negative.";
      if (n > 10) return "Duration cannot exceed 10 hours.";
      return "";
    },
    features: val => {
      if (!val.trim()) return "Features cannot be empty.";
      if (val.length < 20) return "Features must be at least 20 characters.";
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    const error = validators[name](value);
    if (error) toast.error(error, { autoClose: 2000, pauseOnHover: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    for (let key in form) {
      const error = validators[key](form[key]);
      if (error) {
        hasError = true;
        toast.error(error, { autoClose: 2000, pauseOnHover: false });
      }
    }
    if (hasError) return;

    const confirmSubmit = window.confirm("Please double check your details before submitting. Continue?");
    if (!confirmSubmit) return;

    try {
      await axios.post(API_BASE, {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        features: form.features.split(",").map(f => f.trim()),
      });

      toast.success("Package added successfully!", { autoClose: 3000 });
      setForm({ title: "", description: "", price: "", duration: "", features: "" });

    } catch (err) {
      console.error(err);
      toast.error("Failed to create package", { autoClose: 2000 });
    }
  };

  const renderInput = (label, name, type = "text", rows) => (
    <div className="mb-3">
      <label className="block mb-1 text-sm font-bold text-neutral-700">{label}</label> {/* Bold label */}
      {type === "textarea" ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={rows || 3}
          className="w-full border-2 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border-neutral-400 bg-white"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          min={type === "number" ? 0 : undefined}
          className="w-full border-2 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border-neutral-400 bg-white"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" />
      <div className="mx-auto max-w-md px-3">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">📸 Add New Package</h1>
        <p className="text-sm text-neutral-500 mb-4">Add a new photography package with details and pricing.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 border border-neutral-200">
          <div className="grid gap-3">
            {renderInput("Title", "title")}
            {renderInput("Description", "description", "textarea", 4)}
            {renderInput("Price (Rs.)", "price", "number")}
            {renderInput("Duration (Hours)", "duration", "number")}
            {renderInput("Features", "features", "textarea", 4)}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setForm({ title: "", description: "", price: "", duration: "", features: "" })}
              className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-800 hover:bg-neutral-100 transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-900 px-3 py-1 text-sm font-medium text-white hover:bg-blue-800 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PackageCreate;

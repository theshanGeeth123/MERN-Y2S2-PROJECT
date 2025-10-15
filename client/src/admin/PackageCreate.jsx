import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/packages`
  : "http://localhost:4000/api/packages";

function PackageCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    features: "",
    image: ""
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    features: "",
    image: ""
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
      if (!val) return "Price cannot be empty.";
      if (n < 0) return "Price cannot be negative.";
      if (n < 10000) return "Price should not be less than Rs.10,000.";
      if (n > 500000) return "Price cannot exceed Rs.500,000.";
      return "";
    },
    duration: val => {
      const n = Number(val);
      if (!val) return "Duration cannot be empty.";
      if (n <= 0) return "Duration cannot be 0 or negative.";
      if (n > 10) return "Duration cannot exceed 10 hours.";
      return "";
    },
    features: val => {
      if (!val.trim()) return "Features cannot be empty.";
      if (val.length < 20) return "Features must be at least 20 characters.";
      return "";
    },
    image: val => {
      if (!val.trim()) return "Image URL cannot be empty.";
      const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
      if (!urlPattern.test(val)) return "Please enter a valid image URL.";
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validators[name](value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = {};
    for (let key in form) {
      const error = validators[key](form[key]);
      newErrors[key] = error;
      if (error) hasError = true;
    }
    setErrors(newErrors);

    if (hasError) {
      alert("Please fix the errors before submitting."); 
      return;
    }

    const confirmSubmit = window.confirm("Please double check your details before submitting. Continue?");
    if (!confirmSubmit) return;

    try {
      await axios.post(API_BASE, {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        features: form.features.split(",").map(f => f.trim()),
      });

      alert("Package added successfully!");
      navigate("/admin/packages");

    } catch (err) {
      console.error(err);
      alert("Failed to create package");
    }
  };

  // ✅ Demo button handler
  const fillDemoData = () => {
    setForm({
      title: "Baby Photoshoot Package",
      description:
        "Capture precious moments of your baby with a short and fun session.",
      price: "25000",
      duration: "2",
      features:
        "50+ Edited Photos, Indoor/Outdoor Options, Cute Props and Costumes, Optional Printed ",
      image: "https://i.postimg.cc/9MvzDnsF/Whats-App-Image-2025-09-02-at-09-55-14.jpg"
    });
    setErrors({
      title: "",
      description: "",
      price: "",
      duration: "",
      features: "",
      image: ""
    });
  };

  const renderInput = (label, name, type = "text", rows) => (
    <div className="mb-3">
      <label className="block mb-1 text-sm font-bold text-neutral-700">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={rows || 3}
          className={`w-full border-2 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border-neutral-400 bg-white ${errors[name] ? 'border-red-500' : ''}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          min={type === "number" ? 0 : undefined}
          className={`w-full border-2 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border-neutral-400 bg-white ${errors[name] ? 'border-red-500' : ''}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-md px-3">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">📸 Add New Package</h1>
          <p className="text-sm text-neutral-500 mb-4">
            Add a new photography package with details and pricing.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 border border-neutral-200">
            <div className="grid gap-3">
              {renderInput("Title", "title")}
              {renderInput("Description", "description", "textarea", 4)}
              {renderInput("Price (Rs.)", "price", "number")}
              {renderInput("Shoot Duration (Hours)", "duration", "number")}
              {renderInput("Features", "features", "textarea", 4)}
              {renderInput("Image URL", "image")}
            </div>

            <div className="flex justify-between gap-2 mt-4">
              {/* ✅ Demo Button */}
              <button
                type="button"
                onClick={fillDemoData}
                className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600 transition"
              >
                Demo
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ title: "", description: "", price: "", duration: "", features: "", image: "" });
                    setErrors({ title: "", description: "", price: "", duration: "", features: "", image: "" });
                  }}
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PackageCreate;

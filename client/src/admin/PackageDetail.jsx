import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/packages`
    : "http://localhost:4000/api/packages";

function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    features: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
        const p = data?.data || data;
        setForm({
          title: p.title || "",
          description: p.description || "",
          price: p.price || "",
          duration: p.duration || "",
          features: Array.isArray(p.features) ? p.features.join(", ") : p.features || ""
        });
      } catch {
        alert("Failed to load package");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price || form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!form.duration || form.duration <= 0) newErrors.duration = "Duration must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await axios.put(`${API_BASE}/${id}`, {
        ...form,
        features: form.features.split(",").map(f => f.trim()),
      }, { withCredentials: true });

      setShowPopup(true);

      
      setTimeout(() => {
        setShowPopup(false);
        navigate(-1);
      }, 2000);

    } catch {
      alert("Error updating package");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500 text-lg">Loading package...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 py-6 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Update Package
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          
          
          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                errors.title
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

         
          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                errors.description
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300"
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black-700 mb-1">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                  errors.price
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black-700 mb-1">Duration (Hours)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
                  errors.duration
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">Features</label>
            <textarea
              name="features"
              value={form.features}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-md transition font-medium"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      
      {showPopup && (
        <div className="fixed top-5 inset-x-0 flex justify-center z-50">
          <div className="bg-yellow-100 text-black px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
            Package updated successfully!
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageDetail;

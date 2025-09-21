import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaImage,
  FaBox,
  FaDollarSign,
  FaTag,
  FaWarehouse,
  FaArrowLeft,
  FaCheck,
  FaBolt,
} from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin";

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
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // NEW: inline field errors
  const [errors, setErrors] = useState({});

  // Helpers
  const isValidUrl = (u) =>
    /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(
      (u || "").trim()
    );

  const validate = () => {
    const e = {};
    const { name, description, price, url, stock } = formData;

    // Required
    if (!name.trim()) e.name = "Product name is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (price === "" || price === null) e.price = "Price is required.";
    if (!url.trim()) e.url = "Image URL is required.";

    // Business rules
    if (name && name.trim().length < 3)
      e.name = "Name must be at least 3 characters.";
    if (description && description.trim().length < 20)
      e.description = "Description must be at least 20 characters.";
    if (price !== "" && Number(price) <= 0)
      e.price = "Price must be greater than 0.";
    if (url && !isValidUrl(url)) e.url = "Enter a valid http(s) image URL.";
    if (imageError)
      e.url =
        "The image URL is not loading. Please provide a valid image link.";

    if (
      stock !== "" &&
      (!Number.isInteger(Number(stock)) || Number(stock) < 0)
    ) {
      e.stock = "Stock must be an integer ≥ 0.";
    }

    setErrors(e);
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear general and field-specific errors as user types
    if (error) setError("");
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "url") setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // VALIDATE
    const eMap = validate();
    if (Object.keys(eMap).length) {
      setError("Please fix the highlighted fields.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/product", {
        ...formData,
        price: parseFloat(formData.price),
        stock: Number.isFinite(Number(formData.stock))
          ? parseInt(formData.stock, 10)
          : 0,
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

      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      console.error("Add product error:", err.message);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // UI helpers for error styling
  const inputClass = (hasError, extra = "") =>
    `w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${extra} ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;
  const withIconLeft = "pl-10";
  const hint = (msg, id) =>
    msg ? (
      <p id={id} className="mt-1 text-xs text-red-600">
        {msg}
      </p>
    ) : null;

  const handleDemoFill = () => {
    setError("");
    setSuccess(false);
    setImageError(false);
    setErrors({}); // clear inline errors

    setFormData({
      name: "Photography Light LED Kit",
      description:
        "Photography Light LED High Brightness Live COB Fill Light 2700-6500K Adjustable Color Light 95cm Octagonal Softbox",
      price: "10.99",
      url: "https://lumecube.com/cdn/shop/files/231218_Shopify_StudioPanelLightingKit_01_1160x1450_98ba5341-a73e-4b32-94a0-2b831e0f2e9e_1160x.jpg?v=1755543651",
      category: "Equipment",
      stock: "12",
    });
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 2xl:mx-30 xl:mx-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="inline-flex items-center text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>

              <button
                type="button"
                onClick={handleDemoFill}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Demo
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                <FaPlus className="mr-3 text-blue-500" /> Add New Product
              </h1>
              <p className="text-gray-600 mt-2">
                Fill in the details to add a new product to your catalog
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Status Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <FaCheck className="mr-2" /> Product added successfully!
                  Redirecting...
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBox className="text-gray-400" />
                  </div>
                  <input
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass(!!errors.name, withIconLeft)}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                  />
                </div>
                {hint(errors.name, "name-error")}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the product features and details"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={inputClass(!!errors.description)}
                  required
                  aria-invalid={!!errors.description}
                  aria-describedby="description-error"
                />
                {hint(errors.description, "description-error")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaDollarSign className="text-gray-400" />
                    </div>
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={inputClass(!!errors.price, withIconLeft)}
                      required
                      aria-invalid={!!errors.price}
                      aria-describedby="price-error"
                    />
                  </div>
                  {hint(errors.price, "price-error")}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaWarehouse className="text-gray-400" />
                    </div>
                    <input
                      name="stock"
                      type="number"
                      placeholder="Available quantity"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={inputClass(!!errors.stock, withIconLeft)}
                      aria-invalid={!!errors.stock}
                      aria-describedby="stock-error"
                    />
                  </div>
                  {hint(errors.stock, "stock-error")}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400" />
                  </div>
                  <input
                    name="category"
                    placeholder="e.g., Electronics, Clothing, Books"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass(false, withIconLeft)}
                  />
                </div>
              </div>

              {/* Image URL with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="text-gray-400" />
                  </div>
                  <input
                    name="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.url}
                    onChange={handleChange}
                    className={inputClass(!!errors.url, withIconLeft)}
                    required
                    aria-invalid={!!errors.url}
                    aria-describedby="url-error"
                  />
                </div>
                {hint(errors.url, "url-error")}

                {formData.url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={formData.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                      {imageError && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <FaImage className="text-gray-400 text-xl" />
                          <span className="text-xs text-gray-500 ml-1">
                            Invalid URL
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Product
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Fields marked with * are required
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;

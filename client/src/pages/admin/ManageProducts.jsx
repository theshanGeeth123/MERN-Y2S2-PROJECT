import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaBox,
  FaImage,
  FaTimes,
  FaSave,
  FaPlus,
  FaSearch,
  FaFilter,
  FaChartBar,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import NavbarAdmin from "../../components/NavbarAdmin";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    url: "",
    category: "",
    stock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // NEW: inline validation state for edit modal
  const [errors, setErrors] = useState({});
  const [editImageError, setEditImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/product");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:4000/api/product/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err.message);
      toast.error("Failed to delete product");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      url: product.url,
      category: product.category || "",
      stock: product.stock || 0,
    });
    setPreviewImage(product.url);
    setErrors({});
    setEditImageError(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // clear field-specific error on change
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    if (name === "price" || name === "stock") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "url") {
      setEditImageError(false);
      setPreviewImage(value);
    }
  };

  // --- Validators (same rules as AddProduct) ---
  const isValidUrl = (u) =>
    /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(
      (u || "").trim()
    );

  const validateEdit = () => {
    const e = {};
    const { name, description, price, url, stock } = formData;

    // required
    if (!String(name || "").trim()) e.name = "Product name is required.";
    if (!String(description || "").trim())
      e.description = "Description is required.";
    if (price === "" || price === null) e.price = "Price is required.";
    if (!String(url || "").trim()) e.url = "Image URL is required.";
    if (stock === "" || stock === null) e.stock = "Stock is required.";

    // business rules
    if (name && name.trim().length < 3)
      e.name = "Name must be at least 3 characters.";
    if (description && description.trim().length < 20)
      e.description = "Description must be at least 20 characters.";
    if (price !== "" && Number(price) <= 0)
      e.price = "Price must be greater than 0.";
    if (
      stock !== "" &&
      (!Number.isInteger(Number(stock)) || Number(stock) < 0)
    ) {
      e.stock = "Stock must be an integer ≥ 0.";
    }
    if (url && !isValidUrl(url)) e.url = "Enter a valid http(s) image URL.";
    if (editImageError)
      e.url =
        "The image URL is not loading. Please provide a valid image link.";

    setErrors(e);
    return e;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const eMap = validateEdit();
    if (Object.keys(eMap).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/product/${editingProduct._id}`,
        {
          ...formData,
          price: parseFloat(formData.price),
          stock: Number.isFinite(Number(formData.stock))
            ? parseInt(formData.stock, 10)
            : 0,
        }
      );
      toast.success("Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Failed to update product");
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // helpers for error UI inside modal (keeps your layout intact)
  const inputClass = (base = "", hasError = false) =>
    `${base} ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    } focus:border-transparent`;
  const hint = (msg, id) =>
    msg ? (
      <p id={id} className="mt-1 text-xs text-red-600">
        {msg}
      </p>
    ) : null;

  return (

    <>

    <NavbarAdmin />

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 2xl:mx-20 xl:mx-15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Product Management</h1>

            <div className="flex gap-4">
              <a href="/admin/reports">
                 <button className="border px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Sales Report
              </button>
              </a>
             

              <a href="/admin/add-product" >
              <button className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                + Add New Product
              </button></a>
              
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortConfig.key || ""}
                  onChange={(e) =>
                    setSortConfig({
                      key: e.target.value,
                      direction: sortConfig.direction,
                    })
                  }
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Default</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="createdAt">Date Added</option>
                </select>
                {sortConfig.key && (
                  <button
                    onClick={() =>
                      setSortConfig({
                        ...sortConfig,
                        direction:
                          sortConfig.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      })
                    }
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {sortConfig.direction === "ascending" ? "A→Z" : "Z→A"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Count */}
        {!loading && filteredAndSortedProducts.length > 0 && (
          <div className="mb-4 px-2">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredAndSortedProducts.length}
              </span>{" "}
              of <span className="font-semibold">{products.length}</span>{" "}
              products
            </p>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
              <FaBox className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={() => navigate("/admin/add-product")}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <FaPlus className="mr-2" /> Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={product.url}
                    alt={product.name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of Stock"}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    {product.category && (
                      <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <div className="flex justify-between space-x-2">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2.5 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center font-medium"
                    >
                      <FaTrash className="mr-1.5" /> Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center font-medium"
                    >
                      <FaEdit className="mr-1.5" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaEdit className="mr-2 text-blue-500" /> Edit Product
                </h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setErrors({});
                    setEditImageError(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form
                onSubmit={handleEditSubmit}
                className="p-6 space-y-6"
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleEditChange}
                      className={inputClass(
                        "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        !!errors.name
                      )}
                      required
                      aria-invalid={!!errors.name}
                      aria-describedby="edit-name-error"
                    />
                    {hint(errors.name, "edit-name-error")}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleEditChange}
                      className={inputClass(
                        "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        !!errors.price
                      )}
                      min="0"
                      step="0.01"
                      required
                      aria-invalid={!!errors.price}
                      aria-describedby="edit-price-error"
                    />
                    {hint(errors.price, "edit-price-error")}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleEditChange}
                    rows="4"
                    className={inputClass(
                      "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      !!errors.description
                    )}
                    required
                    aria-invalid={!!errors.description}
                    aria-describedby="edit-description-error"
                  />
                  {hint(errors.description, "edit-description-error")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Electronics, Clothing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleEditChange}
                      className={inputClass(
                        "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        !!errors.stock
                      )}
                      min="0"
                      required
                      aria-invalid={!!errors.stock}
                      aria-describedby="edit-stock-error"
                    />
                    {hint(errors.stock, "edit-stock-error")}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleEditChange}
                        className={inputClass(
                          "w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          !!errors.url
                        )}
                        required
                        aria-invalid={!!errors.url}
                        aria-describedby="edit-url-error"
                        placeholder="https://example.com/image.jpg"
                      />
                      {hint(errors.url, "edit-url-error")}
                    </div>
                    <div className="w-full md:w-32 h-32 border border-gray-300 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={previewImage || formData.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          setEditImageError(true);
                          e.target.src =
                            "https://via.placeholder.com/128?text=No+Image";
                        }}
                        onLoad={() => setEditImageError(false)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        formData.stock > 0 ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setErrors({});
                        setEditImageError(false);
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center font-medium shadow-md hover:shadow-lg"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ManageProducts;

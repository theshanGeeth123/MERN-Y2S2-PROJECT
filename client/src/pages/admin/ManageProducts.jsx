import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    url: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/product");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/product/${id}`);
      toast.success("Product deleted ✅");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err.message);
      toast.error("Failed to delete product ❌");
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
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/product/${editingProduct._id}`,
        formData
      );
      toast.success("Product updated ✅");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Failed to update product ❌");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        📋 Manage Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={product.url}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md mb-3"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.description}</p>
              <p className="font-bold text-green-600 mt-1">${product.price}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>

                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
          >
            <h3 className="text-2xl font-bold mb-4">✏️ Edit Product</h3>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-2">
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-4">
              Image URL:
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>

            <label className="block mb-2">
  Category:
  <input
    type="text"
    name="category"
    value={formData.category}
    onChange={handleEditChange}
    className="w-full border rounded p-2 mt-1"
  />
</label>

<label className="block mb-2">
  Stock:
  <input
    type="number"
    name="stock"
    value={formData.stock}
    onChange={handleEditChange}
    className="w-full border rounded p-2 mt-1"
    min="0"
  />
</label>

<p className="text-sm text-gray-600 mt-2">
  Availability:{" "}
  <span className={formData.stock > 0 ? "text-green-600" : "text-red-600"}>
    {formData.stock > 0 ? "Available" : "Unavailable"}
  </span>
</p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

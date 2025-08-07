import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

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
      fetchProducts(); // refresh
    } catch (err) {
      console.error("Delete error:", err.message);
      toast.error("Failed to delete product ❌");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📋 Manage Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-xl shadow-md">
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
                  onClick={() => alert("Edit feature coming soon")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

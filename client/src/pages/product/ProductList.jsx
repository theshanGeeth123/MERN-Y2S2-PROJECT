import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { userData } = useContext(AppContent);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/product");
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await axios.post("http://localhost:4000/api/cart/add", {
        userId: userData.id,
        productId,
        quantity: 1,
      });
      alert("Added to cart ✅");
    } catch (error) {
      console.error("Add to cart error:", error.message);
      alert("Failed to add to cart ❌");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🛍️ Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
            <img
              src={product.url}
              alt={product.name}
              className="h-48 w-full object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-500 text-sm">{product.description}</p>
            <p className="text-green-600 font-bold mt-2">${product.price}</p>

            <button
              onClick={() => addToCart(product._id)}
              className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaStar, FaRegStar, FaFilter } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/product");
        const data = await res.json();
        const productsData = data.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    updateCartCount();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, sortOption, categoryFilter, products]);

  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = storedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Default sorting (by popularity or newest)
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleQuantityChange = (productId, quantity) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, selectedQty: quantity } : p))
    );
  };

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const qty = product.selectedQty || 1;

    if (!product.stock || product.stock < qty) {
      showMessage(`Only ${product.stock || 0} item(s) in stock`, "error");
      return;
    }

    const existingIndex = storedCart.findIndex((item) => item._id === product._id);
    if (existingIndex >= 0) {
      const newQty = storedCart[existingIndex].quantity + qty;
      if (newQty > product.stock) {
        showMessage(`Can't add more than ${product.stock} for "${product.name}"`, "error");
        return;
      }
      storedCart[existingIndex].quantity = newQty;
    } else {
      storedCart.push({ ...product, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    updateCartCount();
    showMessage(`${qty} "${product.name}" added to cart`, "success");
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(""), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Premium Products
          </h1>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            
            <button
              onClick={() => navigate("/cart")}
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <FaShoppingCart className="mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center text-gray-700 mr-4"
            >
              <FaFilter className="mr-1" /> Filters
            </button>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
          
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        
        {/* Category Filters */}
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  categoryFilter === "all" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    categoryFilter === category 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 flex items-center justify-center bg-gray-50 p-4">
                <img
                  src={product.url}
                  alt={product.name}
                  className="object-contain max-h-40 transition-transform duration-300 hover:scale-105"
                />
                {product.stock < 10 && product.stock > 0 && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Low Stock
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {renderStars(product.rating || 4.5)}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.reviews || 24})</span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <label className="text-sm text-gray-700">Qty:</label>
                  <select
                    value={product.selectedQty || 1}
                    onChange={(e) =>
                      handleQuantityChange(product._id, parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    disabled={product.stock === 0}
                  >
                    {[...Array(Math.min(5, product.stock))].map((_, i) => (
                      <option key={i+1} value={i+1}>
                        {i+1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Message */}
      {message && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium transition-all duration-300 ${
          message.type === "error" 
            ? "bg-red-100 text-red-700 border border-red-200" 
            : "bg-green-100 text-green-700 border border-green-200"
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ProductList;
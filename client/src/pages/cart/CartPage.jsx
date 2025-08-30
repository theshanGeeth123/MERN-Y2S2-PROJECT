import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for better UX
    setTimeout(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
      setIsLoading(false);
    }, 300);
  }, []);

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const incrementQuantity = (productId) => {
    const item = cart.find(item => item._id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decrementQuantity = (productId) => {
    const item = cart.find(item => item._id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const shippingCost = cartTotal > 0 ? 5.99 : 0;
  const tax = cartTotal * 0.08; // Example tax calculation
  const finalTotal = cartTotal + shippingCost + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-600">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <li key={index} className="p-6 flex flex-wrap sm:flex-nowrap">
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full sm:w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                        <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">SKU: {item._id.slice(-6)}</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>

                        <div className="mt-4 flex items-center">
                          <span className="mr-3 text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => decrementQuantity(item._id)}
                              className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-md"
                              disabled={item.quantity <= 1}
                            >
                              <span className="sr-only">Decrease quantity</span>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="h-10 w-12 flex items-center justify-center border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item._id)}
                              className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-md"
                            >
                              <span className="sr-only">Increase quantity</span>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item._id)}
                            className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-6 text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0 lg:col-span-5">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">${shippingCost.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Tax</dt>
                    <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">${finalTotal.toFixed(2)}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Checkout
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">or</p>
                  <button onClick={() => navigate("/products")}
                    
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 text-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for your purchase.</p>
      <a
        href="/customer"
        className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
};

export default PaymentSuccess;

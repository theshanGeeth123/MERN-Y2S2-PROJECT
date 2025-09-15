import React from 'react';

const PaymentSuccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-green-50">
    <div className="bg-white p-10 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-green-600">✅ Payment Successful!</h2>
      <p className="mt-4 text-gray-700">Your order has been placed and is being processed.</p>
    </div>
  </div>
);

export default PaymentSuccess;

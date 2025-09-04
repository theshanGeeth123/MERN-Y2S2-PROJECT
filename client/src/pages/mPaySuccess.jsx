import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

 
  const { items = [], totalPaid = 0 } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      

      <CheckCircle className="w-20 h-20 text-green-600 mb-6" />

      <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
        Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6 text-center">
        Thank you for your payment. Your rental request has been received.
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Rental Summary</h2>
        <ul className="mb-4 space-y-2">
          {items.map((item, index) => (
            <li
              key={item._id || index}
              className="flex justify-between border-b pb-2"
            >
              <span>{item.name}</span>
              <span>Deposit: Rs. 500</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg">
          <span>Total Paid:</span>
          <span>Rs. {totalPaid}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/all-rentals")}
        className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
      >
        Back to Rentals
      </button>
    </div>
  );
}

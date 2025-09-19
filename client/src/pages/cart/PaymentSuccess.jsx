import React, { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className={`max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-8">
          {/* Animated Checkmark */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-green-600 animate-checkmark" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-2 text-center">Thank you for your purchase.</p>
          <p className="text-gray-500 text-center mb-8">A confirmation email has been sent to your inbox.</p>
          
          {/* Order Details */}
          
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/customer-home"
              className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 font-medium text-center shadow hover:shadow-md"
            >
              Back to Home
            </a>
            <a href="/my-orders">
            <button  className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm hover:shadow">
              View Order Details
            </button>
            </a>
          </div>
          
          {/* Support Message */}
          {/* <p className="text-sm text-gray-500 mt-8 text-center">
            Need help? <a href="/contact" className="text-green-600 hover:text-green-700 font-medium">Contact Support</a>
          </p> */}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-checkmark {
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
import React from "react";
import { useRentItemsStore } from "../mstore/mrentItems";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


const MRentalCart = () => {
  const rentalCart = useRentItemsStore((state) => state.rentalCart);
  const removeFromCart = useRentItemsStore((state) => state.removeFromCart);
  const clearCart = useRentItemsStore((state) => state.clearCart);

  const location = useLocation();
  const { items: rentedItems } = location.state || { items: rentalCart || [] };

  const navigate = useNavigate();

  const FIXED_DEPOSIT = 500; // Fixed deposit

  // Calculate total
  const getTotalDeposit = (itemsList) => {
    return itemsList.length * FIXED_DEPOSIT;
  };

  const handleProceedToPay = () => {
    const totalDeposit = getTotalDeposit(rentedItems);
    navigate("/payment/create-payment-intent", {
      state: { items: rentedItems, totalDeposit },
    });
  };

  if (!rentedItems || rentedItems.length === 0)
    return <div className="p-6 text-center text-lg">Your cart is empty.</div>;

  return (
    <div className="p-6">
      <Navbar/>
      <h2 className="text-2xl font-bold mb-4 text-center mt-10 mb-10">
        Confirm Your Payment
      </h2>

      <div className="text-xl mb-4 text-gray-700 flex justify-center text-center mt-10 mb-10">
        <div className="text-red-700 font-bold">Important Message: </div>
        You can edit your requirements even after completing the payment.<br />  
        However, we do not accept any refunds for your requests. <br /> 
        If the store rejects your request, a refund may be allowed at the store’s discretion.
      </div>

      <div className="w-full flex justify-center">
        <ul className="space-y-3 mb-6 w-3/4">
          {rentedItems.map((item) => (
            <li
              key={item._id}
              className="bg-[#333A5C66] p-3 rounded-lg text-center"
            >
              {item.name} - Deposit: Rs. {FIXED_DEPOSIT}.00
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 font-semibold text-lg text-center">
        Total Deposit: Rs. {getTotalDeposit(rentedItems)}.00
      </div>
      
      <div className="w-full flex justify-center">
        <button
          className="px-6 py-2 bg-green-500 rounded-full hover:bg-green-600 mt-5"
          onClick={handleProceedToPay}
        >
          Proceed to Pay
        </button>
      </div>
      <div className="w-full flex justify-center mt-1">
        <Link
          to="/cart"
          className="text-blue-500 hover:underline"
        >
           Back to Rental Cart
        </Link>
      </div>
    </div>
  );
};

export default MRentalCart;

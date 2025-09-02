import React from "react";
import { useLocation } from "react-router-dom";
import { useRentItemsStore } from "../mstore/mrentItems";



function PaymentPage() {
  const location = useLocation();
  const { items, total } = location.state || { items: [], total: 0 };

  const getTotalDeposit = useRentItemsStore((state) => state.getTotalDeposit);
  const totalDeposit = getTotalDeposit();

  return (
    <div className="p-6 text-black">

      
        <div className="text-xl mb-4 text-gray-700 flex justify-center text-center mt-20 mb-10">
        <div className="w-fullflex text-center text-red-700 font-bold">Important Message: </div>
        You can edit your requirements even after completing the payment.<br/>  
        However, we do not accept any refunds for your requests. <br/> 
        If the store rejects your request, a refund may be allowed at the store’s discretion.
      </div>

      
      <h2 className="text-2xl font-bold mb-4 text-gray-700 flec text-center mb-10">Confirm Payment</h2>

      <div className="w-full flex justify-center">
        <ul className="space-y-3 mb-6 w-3/4">
          {items.map((item) => (
          <li key={item._id} className="bg-[#333A5C66] p-3 rounded-lg text-center">
          {item.name} - need to Deposit Rs. 500.00
          </li>
          ))}
        </ul>
      </div>

      <h3 className="text-xl mb-4 text-gray-700 text-center">Total Rental Deposit: Rs. {total||totalDeposit}</h3>
      <div className="w-full flex justify-center">
      <button className="px-6 py-2 bg-green-500 rounded-full hover:bg-green-600 mt-10">
        Proceed to Pay
      </button>
      </div>
    </div>
  );
}

export default PaymentPage;

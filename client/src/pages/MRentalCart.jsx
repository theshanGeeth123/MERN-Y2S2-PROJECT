import React from "react";
import { useRentItemsStore } from "../mstore/mrentItems";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {Link} from "react-router-dom";

const MRentalCart = () => {
  const rentalCart = useRentItemsStore((state) => state.rentalCart);
  const removeFromCart = useRentItemsStore((state) => state.removeFromCart);
  const clearCart = useRentItemsStore((state) => state.clearCart);
  const getTotalDeposit = useRentItemsStore((state) => state.getTotalDeposit);

  const navigate = useNavigate();

  const handleRentAll = () => {
    const totalDeposit = getTotalDeposit();
    navigate("/payment", { state: { items: rentalCart, totalDeposit } });
  };

  if (!rentalCart || rentalCart.length === 0)
  return (
    <>
      <Navbar />
      <div className="mt-20 flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-slate-900 p-10 rounded-2xl shadow-lg w-full sm:w-11/12 text-center text-white text-xl font-bold">
         🤔 Your cart is empty.
         <div className="mt-2 font-light">
          <Link
          to="/all-rentals"
          className="text-blue-500 hover:underline"
        >
           Back to Rentals
        </Link>
         </div>
        </div>
        
      </div>
    </>
  );


  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center mt-20 mb-10">
          Your Rental Cart
        </h2>
        <ul className="space-y-4">
          {rentalCart.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>Category: {item.category}</p>
                <p>Price: Rs. {item.price}</p>
              </div>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 font-semibold text-lg text-center mt-10">
          Total Deposit: Rs. {getTotalDeposit()}
        </div>

        <div className="mt-4 w-full flex justify-end mr-10">
          <button
            className="mt-4 px-6 py-2 border border-black bg-white text-black font-bold rounded-md hover:bg-blue-600 transition-colors"
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <button
            type="button"
            onClick={handleRentAll}
            className="mt-4 px-6 py-2 border border-black bg-white text-black font-bold rounded-md ml-10 hover:bg-green-600 transition-colors"
          >
            Rent Items
          </button>
        </div>
      </div>
    </>
  );
};

export default MRentalCart;

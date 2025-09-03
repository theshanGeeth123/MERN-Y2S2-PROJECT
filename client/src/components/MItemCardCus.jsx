import React from "react";
import { useRentItemsStore } from "../mstore/mrentItems";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MItemCardCus({ item }) {
  const addToCart = useRentItemsStore((state) => state.addToCart);
  const navigate = useNavigate();

  const FIXED_DEPOSIT = 500; // Fixed deposit for all items

  const handleRentNow = () => {
    navigate("/payment", {
      state: { items: [item], totalDeposit: FIXED_DEPOSIT },
    });
  };

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item?.name} added to rental cart!`, {
      position: "top-center",
      autoClose: 5000,
    });
  };

  return (
    <div className="bg-[#333A5C66] p-5 rounded-2xl shadow-md text-white flex flex-col justify-between hover:scale-105 transition-transform">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <div>
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-300">{item.category}</p>
        <p className="text-indigo-300 font-bold">Deposit: Rs. {FIXED_DEPOSIT}</p>
        <p className="mt-2 text-gray-200 line-clamp-3">{item.description}</p>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={handleRentNow}
          className="px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
        >
          Rent Now
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="px-4 py-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default MItemCardCus;

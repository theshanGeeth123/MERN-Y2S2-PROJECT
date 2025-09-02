import React from "react";
import { useRentItemsStore } from "../mstore/mrentItems";
import { useNavigate } from "react-router-dom";

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
    return <div className="p-6 text-center text-lg">Your cart is empty.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Rental Cart</h2>
      <ul className="space-y-4">
        {rentalCart.map((item) => (
          <li key={item._id} className="flex justify-between items-center border p-4 rounded">
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
      <div className="mt-6 font-semibold text-lg">
        Total Deposit: Rs. {getTotalDeposit()}
      </div>

      <div className="mt-4 flex justify-right">
        <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
        onClick={clearCart}
      >
        Clear Cart
      </button>
      <button
        type="button"
        onClick={handleRentAll}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded ml-10"
      >
          Rent Items
        </button>
      </div>
    </div>
  );
};

export default MRentalCart;

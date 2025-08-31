import React, { useState } from "react";
import { useRentItemsStore } from "../mstore/mrentItems";
import { useNavigate } from "react-router-dom";

function MRental() {
  const [newRntal, setnewRental] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });


  const {addItem} = useRentItemsStore();
  const navigate = useNavigate();

const handleAddRental = async () => {
  const { success, message } = await addItem(newRntal); 
  console.log("Success:", success);
  console.log("Message:", message);
  alert(message);
  if (success) {
      navigate("/all-rentals"); 
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-slate-900 p-10 rounded-2xl shadow-lg w-full sm:w-1/3 text-indigo-300 h-[75vh]">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Add New Rental
        </h2>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAddRental(); }}>
          {/* Item Name */}
          <div className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full bg-[#333A5C66]">
            <input
              type="text"
              placeholder="Item Name"
              className="bg-transparent outline-none w-full text-white"
              value={newRntal.name}
              onChange={(e) => setnewRental({ ...newRntal, name: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full bg-[#333A5C66]">
            <input
              type="text"
              placeholder="Category"
              className="bg-transparent outline-none w-full text-white"
              value={newRntal.category}
              onChange={(e) => setnewRental({ ...newRntal, category: e.target.value })}
              required
            />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full bg-[#333A5C66]">
            <input
              type="number"
              placeholder="Price"
              min={0}
              className="bg-transparent outline-none w-full text-white"
              value={newRntal.price}
              onChange={(e) => setnewRental({ ...newRntal, price: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full bg-[#333A5C66]">
            <input
              type="text"
              placeholder="Description"
              className="bg-transparent outline-none w-full text-white"
              value={newRntal.description}
              onChange={(e) => setnewRental({ ...newRntal, description: e.target.value })}
              required
            />
          </div>

          {/* Image URL */}
          <div className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full bg-[#333A5C66]">
            <input
              type="text"
              placeholder="Image URL"
              className="bg-transparent outline-none w-full text-white"
              value={newRntal.image}
              onChange={(e) => setnewRental({ ...newRntal, image: e.target.value })}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
            type="submit"
            className="sm:w-2/3 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
          >
            Add Rental
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MRental;



/*
100%	#1e293bFF	Fully opaque
90%	#1e293BE6	90% opacity
80%	#1e293BCC	80% opacity
70%	#1e293BB3	70% opacity
60%	#1e293B99	60% opacity
50%	#1e293B80	50% opacity
40%	#1e293B66	40% opacity
30%	#1e293B4D	30% opacity
20%	#1e293B33	20% opacity
10%	#1e293B1A	10% opacity
0%	#1e293B00	Fully transparent
*/

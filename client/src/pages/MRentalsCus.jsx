import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRentItemsStore } from "../mstore/mrentItems";
import ItemCardCus from "../components/MItemCardCus";
import Navbar from "../components/Navbar";
import { ShoppingBag } from "lucide-react";

function MRentalCus() {
  const fetchRItems = useRentItemsStore((state) => state.fetchRItems); 
  const rentItems = useRentItemsStore((state) => state.rentItems);     
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchRItems();
  }, [fetchRItems]);


  const filteredItems =
    selectedCategory === "All"
      ? rentItems
      : rentItems.filter((item) => item.category === selectedCategory);

  return (
    <div>
      <Navbar />

      {/* Top Add Rental Item Button */}
      <div className="w-full flex justify-end mt-5 pr-6">
      <Link to="/cart">
        <button className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-transparent bg-gradient-to-r from-[#07E041AA] to-[#078DE0AA] text-white font-semibold hover:scale-105 hover:opacity-90 transition mr-15">
          <ShoppingBag size={18}/>
          Rental Cart
        </button>
      </Link>
      </div>


      <div className="flex flex-col items-center min-h-screen mt-10 mb-20">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent mb-8">
          Rental Items
        </h2>

        {/* Category */}
        <div className="flex flex-wrap gap-4 mb-10">
          {["All", "Photography Camera", "Video Camera", "Drone","Camera Lens", "Lighting"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* show items */}
        <div className="bg-slate-900 p-10 rounded-2xl shadow-lg w-full sm:w-11/12 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => <ItemCardCus key={item._id} item={item} />)
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <p className="text-xl font-semibold text-gray-300 mb-4">
                  😔 No Items Founded {" "}
                </p>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MRentalCus;

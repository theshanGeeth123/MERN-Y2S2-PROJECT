import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRentItemsStore } from "../mstore/mrentItems";
import ItemCard from "../components/ItemCard";
import AdminNavbar from "../components/AdminNavbar";

function MRentPage() {
  const { fetchRItems, rentItems } = useRentItemsStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchRItems();
  }, [fetchRItems]);

  // Filter function
  const filteredItems =
    selectedCategory === "All"
      ? rentItems
      : rentItems.filter((item) => item.category === selectedCategory);

  return (
    <div>
      <AdminNavbar />

      {/* Top Add Rental Item Button */}
      <div className="w-full flex justify-end mt-5 pr-6">
        <Link to="/rental">
          <button className="px-6 py-2 rounded-full border-2 border-transparent bg-[#333A5C66] bg-origin-border text-gradient-to-r from-slate-900 to-indigo-800 font-semibold hover:scale-105 hover:bg-[#333A5CA0] transition mr-15 ">
            Add Rental Item
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center min-h-screen mt-10 mb-20">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent mb-8">
          Rental Items
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-10">
          {["All", "Photography Camera", "Video Camera", "Drone","Camera Lens"].map((category) => (
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

        {/* Items Grid */}
        <div className="bg-slate-900 p-10 rounded-2xl shadow-lg w-full sm:w-11/12 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => <ItemCard key={item._id} item={item} />)
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <p className="text-xl font-semibold text-gray-300 mb-4">
                  No Items Found{" "}
                </p>
                <Link
                  to="/rental"
                  className="text-blue-500 hover:underline font-bold"
                >
                  Add a new Item
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MRentPage;

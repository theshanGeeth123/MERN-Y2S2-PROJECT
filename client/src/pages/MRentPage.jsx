import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRentItemsStore } from "../mstore/mrentItems";
import ItemCard from "../components/ItemCard";
import Navbar from '../components/Navbar'
import Header from '../components/Header'

function MRentPage() {
  const { fetchRItems, rentItems } = useRentItemsStore();

  useEffect(() => {
    fetchRItems();
  }, [fetchRItems]);

  return (
    <div >
      <Navbar/>
      <div className="w-full flex justify-end mt-5">
        <Link to="/rental">
          <button
            className="px-6 py-2 rounded-full border-2 border-transparent bg-[#333A5C66] bg-origin-border text-gradient-to-r from-slate-900 to-indigo-800 font-semibold hover:scale-105 hover:bg-[#333A5CA0] transition mr-5 ">
            Add Rental Item
          </button>
        </Link>
        
      </div>

      <div className="flex flex-col items-center min-h-screen mt-50 mb-10">

        <h2 className="text-6xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent mb-50">
        Rental Items
      </h2>

      
      <div className="bg-slate-900 p-20 rounded-2xl shadow-lg w-full sm:w-9/10 text-center">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentItems && rentItems.length > 0 ? (
            rentItems.map((item) => (

              <ItemCard
                key={item._id}
                item={item} />
              
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <p className="text-xl font-semibold text-gray-300 mb-4">
                No Item Found {" "}
              </p>
              <Link
                to="/Rental"
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

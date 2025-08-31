import React from "react";
import { useRentItemsStore } from "../mstore/mrentItems";

function ItemCard({ item }) {



    //delete function//
  const { deleteItem } = useRentItemsStore();


  const handleDeletePost = async (rid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");

    //confirm befor deleting//
    if (!confirmDelete) return; 
    
    const { success, message } = await deleteItem(rid);
    //alerts for delete//
    if (!success) {
      alert(" Error: " + message);
    } else {
      alert(" Success: " + message);
    }
  };

  return (

    //all items view//
    <div className="bg-[#333A5C66] p-5 rounded-2xl shadow-md text-white flex flex-col justify-between transform transition-transform hover:scale-105 hover:shadow-xl">
      
    {/* image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      {/* content */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-300">{item.category}</p>
        <p className="text-indigo-300 font-bold">Rs.{" "}{item.price}</p>
        <p className="mt-2 text-gray-200 line-clamp-3">{item.description}</p>
      </div>

      
      <div className="mt-4 flex justify-center">
        {/* Update button */}
        <button className="px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors mr-2">
          Update
        </button>
        {/* delete button */}
        <button
          onClick={() => handleDeletePost(item._id)}
          className="px-4 py-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemCard;

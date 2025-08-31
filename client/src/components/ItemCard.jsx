import React from "react";

function ItemCard({ item }) { 

  return (
    <div className="bg-[#333A5C66] p-5 rounded-2xl shadow-md text-white flex flex-col justify-between transform transition-transform hover:scale-105 hover:shadow-xl">
      
      
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-300">{item.category}</p>
        <p className="text-indigo-300 font-bold">${item.price}</p>
        <p className="mt-2 text-gray-200 line-clamp-3">{item.description}</p>
      </div>

      
      <div className="mt-4 flex justify-center">
        <button className="px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors mr-2">
          Update
        </button>
        <button className="px-4 py-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemCard;

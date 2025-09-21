import React, { useState, useEffect } from "react";
import { useRentItemsStore } from "../mstore/mrentItems";
import { toast } from "react-toastify";

function ItemCard({ item }) {
  const { deleteItem, updatedItem } = useRentItemsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });

  // Lock background
  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isEditing]);

  // Delete
  const handleDeletePost = async (rid) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const { success, message } = await deleteItem(rid);
    toast.success(`${item?.name} Deleted Successfully`, {
          position: "top-center",
          autoClose: 3000,
        });
  };

  // Update
  const handleUpdate = async () => {
    const { success, message } = await updatedItem(item._id, editData);
    toast.success(`${item?.name} Updated Successfully`, {
          position: "top-center",
          autoClose: 3000,
        });
    if (success) setIsEditing(false);
  };

  return (
    <div className={`bg-[#333A5C66] p-5 rounded-2xl shadow-md text-white flex flex-col justify-between transform transition-transform ${isEditing ? "" : "hover:scale-105 hover:shadow-xl"}`}>
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-xl mb-4" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-300">{item.category}</p>
        <p className="text-indigo-300 font-bold">Rs. {item.price}</p>
        <p className="mt-2 text-gray-200 line-clamp-3">{item.description}</p>
      </div>

      <div className="mt-4 flex justify-center">
        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors mr-2">Update</button>
        <button onClick={() => handleDeletePost(item._id)} className="px-4 py-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors">Delete</button>
      </div>

      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-[#333A5C66] flex justify-center items-center z-50" onClick={() => setIsEditing(false)}>
          <div className="bg-gray-900 p-6 rounded-2xl w-11/12 max-w-md max-h-[90vh] overflow-auto space-y-4 text-white pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-center">Update Item</h2>

            <input type="text" className="w-full p-3 rounded text-white bg-[#333A5C66]" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Name" />
            <input type="text" className="w-full p-3 rounded text-white bg-[#333A5C66]" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} placeholder="Category" />
            <input type="number" className="w-full p-3 rounded text-white bg-[#333A5C66]" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} placeholder="Price" />
            <input type="text" className="w-full p-3 rounded text-white bg-[#333A5C66]" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description" />
            <input type="text" className="w-full p-3 rounded text-white bg-[#333A5C66]" value={editData.image} onChange={(e) => setEditData({ ...editData, image: e.target.value })} placeholder="Image URL" />

            <div className="flex justify-center space-x-2 mt-3">
              <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 rounded-full font-bold hover:bg-green-600 transition-colors w-3/10">Save</button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 rounded-full font-bold hover:bg-gray-600 transition-colors w-3/10">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemCard;

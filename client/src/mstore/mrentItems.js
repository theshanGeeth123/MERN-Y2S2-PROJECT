import { create } from "zustand";

export const useRentItemsStore = create((set) => ({
  // Store all rental items here
  rentItems: [],

  // Add a new rental item
  addItem: async (newRental) => {
    if (
      !newRental.name ||
      !newRental.category ||
      newRental.price === "" ||
      !newRental.description ||
      !newRental.image
    ) {
      return { success: false, message: "Please fill in all the fields" };
    }

    if (newRental.price == 0) {
      return { success: false, message: "Price has not Updated" };
    }

    try {
      const res = await fetch("/api/rentalItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRental),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          message: errorData.message || "Failed to add rental item",
        };
      }

      const data = await res.json();

      // Add new item to rentItems array
      set((state) => ({
        rentItems: [...state.rentItems, data.data],
      }));


      return { success: true, message: "Rental Item was added successfully" };
    } catch (error) {
      return { success: false, message: error.message || "Network error" };
    }
  },

  // Fetch all rental items from backend
  fetchRItems: async () => {
    try {
      const res = await fetch("/api/rentalItems");
      if (!res.ok) throw new Error("Failed to fetch rental items");

      const data = await res.json();


      set({ rentItems: data.data || [] });
    } catch (error) {
      console.error("Error fetching rental items:", error.message);
      set({ rentItems: [] });
    }
  },


 // Delete an item
  deleteItem: async (rid) => {
    try {
      const res = await fetch(`/api/rentalItems/${rid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        rentItems: state.rentItems.filter((item) => item._id !== rid),
      }));

      return { success: true, message: "Item deleted successfully" };
    } catch (error) {
      return { success: false, message: error.message || "Delete failed" };
    }
  },

}));

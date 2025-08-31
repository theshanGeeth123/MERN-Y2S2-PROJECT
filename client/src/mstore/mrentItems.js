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

      // Store data in rentItems
      // If backend returns array directly, use: set({ rentItems: data || [] })
      set({ rentItems: data.data || [] });
    } catch (error) {
      console.error("Error fetching rental items:", error.message);
      set({ rentItems: [] });
    }
  },
}));

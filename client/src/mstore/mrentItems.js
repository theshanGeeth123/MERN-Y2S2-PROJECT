import { create } from "zustand";

export const useRentItemsStore = create((set) => ({
  rentItems: [],

  addItem: async (newRental) => {
    if (!newRental.name || !newRental.category || !newRental.price || !newRental.description || !newRental.image)
      return { success: false, message: "Please fill in all the fields" };
    if (newRental.price==0)
      return { success: false, message: "Price has not changed" };
    try {
      const res = await fetch("/api/rentalItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRental),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ rentItems: [...state.rentItems, data.data] }));
      return { success: true, message: "Rental Item was added successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  fetchRItems: async () => {
    try {
      const res = await fetch("/api/rentalItems");
      const data = await res.json();
      set({ rentItems: data.data || [] });
    } catch (error) {
      set({ rentItems: [] });
    }
  },

  updatedItem: async (rid, updatedItem) => {
    try {
      const res = await fetch(`/api/rentalItems/${rid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        rentItems: state.rentItems.map((item) => (item._id === rid ? data.data : item)),
      }));

      return { success: true, message: "Item updated successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  deleteItem: async (rid) => {
    try {
      const res = await fetch(`/api/rentalItems/${rid}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        rentItems: state.rentItems.filter((item) => item._id !== rid),
      }));

      return { success: true, message: "Item deleted successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
}));

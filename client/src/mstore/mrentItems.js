import { create } from "zustand";

export const useRentItemsStore = create((set) => ({
  rentItems: [],


  setRentItems: (rentItems) => set({ rentItems }),

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
      alert(message);
    }

    try {
      const res = await fetch("/api/rentalItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRental),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Failed to add rental item" };
      }

      const data = await res.json();

   
      set((state) => ({
        rentItems: [...state.rentItems, data.data],
      }));

      return { success: true, message: "Rental Item was added successfully" };
    } catch (error) {
      return { success: false, message: error.message || "Network error" };
    }
  },
}));


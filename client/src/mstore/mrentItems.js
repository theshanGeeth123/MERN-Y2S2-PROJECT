import { create } from "zustand";

export const useRentItemsStore = create((set, get) => ({
  rentItems: [],
  rentalCart: [],

  addItem: async (newRental) => {
    if (!newRental.name || !newRental.category || !newRental.price || !newRental.description || !newRental.image)
      return { success: false, message: "Please fill in all the fields" };
    if (newRental.price==0)
      return { error: true, message: "Price has not changed" };
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


  
   rentalCart: JSON.parse(localStorage.getItem("rentalCart")) || [],

  // Add item with quantity support
  addToCart: (item, quantity = 1) => {
    set((state) => {
      const existingItemIndex = state.rentalCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      let updatedCart;

      if (existingItemIndex >= 0) {
        // Item exists → increase quantity
        updatedCart = [...state.rentalCart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        // Item does not exist → add new item with quantity
        updatedCart = [...state.rentalCart, { ...item, quantity }];
      }

      localStorage.setItem("rentalCart", JSON.stringify(updatedCart));
      return { rentalCart: updatedCart };
    });
  },

  removeFromCart: (id) => {
    set((state) => {
      const updatedCart = state.rentalCart.filter((item) => item._id !== id);
      localStorage.setItem("rentalCart", JSON.stringify(updatedCart));
      return { rentalCart: updatedCart };
    });
  },

  clearCart: () => {
    set({ rentalCart: [] });
    localStorage.removeItem("rentalCart");
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      const updatedCart = state.rentalCart.map((item) =>
        item._id === id ? { ...item, quantity: quantity } : item
      );
      localStorage.setItem("rentalCart", JSON.stringify(updatedCart));
      return { rentalCart: updatedCart };
    });
  },
  /*
  getTotalDeposit: () =>
  get().rentalCart.reduce(
    (acc) => acc + 500, 
    0
  ),
*/

 getTotalDeposit: () => {
    return get().rentalCart.reduce(
      (total, item) => total + 500* (item.quantity || 1),
      0
    );
  },


}));

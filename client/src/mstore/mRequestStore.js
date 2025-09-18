import { create } from "zustand";

export const useRequestStore = create((set, get) => ({
  requests: [],

  // Add new rental request
  /*
  addRequest: async (newRequest) => {
    try {
      const res = await fetch("http://localhost:4000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ requests: [...state.requests, data.data] }));
      return { success: true, message: "Rental request added successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
*/

addRequest: async (newRequest) => {
  try {
    const res = await fetch("http://localhost:4000/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
      credentials: "include", // ✅ keep session cookies
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ requests: [...state.requests, data.data] }));
    return { success: true, message: "Rental request added successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
},



  // Fetch all rental requests
  fetchRequests: async () => {
    try {
      const res = await fetch("http://localhost:4000/api/requests");
      const data = await res.json();
      set({ requests: data.data || [] });
    } catch (error) {
      set({ requests: [] });
    }
  },
  

  // Update a request
  updateRequest: async (rid, updatedRequest) => {
    try {
      const res = await fetch(`http://localhost:4000/api/requests/${rid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRequest),
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === rid ? data.data : req
        ),
      }));

      return { success: true, message: "Request updated successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete a request
  deleteRequest: async (rid) => {
    try {
      const res = await fetch(`http://localhost:4000/api/requests/${rid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        requests: state.requests.filter((req) => req._id !== rid),
      }));

      return { success: true, message: "Request deleted successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
}));


/*
import { create } from "zustand";
import axios from "axios";

export const useRequestStore = create((set) => ({
  requests: [],
  loading: false,
  error: null,

  // Fetch all requests for logged-in customer
  fetchRequests: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("/api/requests/my-requests", {
        withCredentials: true,
      });
      set({ requests: res.data.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch requests",
        loading: false,
      });
    }
  },

  // Create a new request
  addRequest: async (formData) => {
    try {
      const res = await axios.post("/api/requests", formData, {
        withCredentials: true,
      });
      set((state) => ({
        requests: [res.data.data, ...state.requests],
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create request" });
    }
  },

  // Update request
  updateRequest: async (id, formData) => {
    try {
      const res = await axios.put(`/api/requests/${id}`, formData, {
        withCredentials: true,
      });
      set((state) => ({
        requests: state.requests.map((r) =>
          r._id === id ? res.data.data : r
        ),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update request" });
    }
  },

  // Delete request
  deleteRequest: async (id) => {
    try {
      await axios.delete(`/api/requests/${id}`, { withCredentials: true });
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== id),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete request" });
    }
  },
}));
*/
// frontend/mstore/mRequestStore.js
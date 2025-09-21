import { create } from "zustand";

export const useRequestStore = create((set, get) => ({
  requests: [],
  processedRequests: [],
  loading: false,
  error: null,


addRequest: async (newRequest) => {
  try {
    const res = await fetch("http://localhost:4000/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
      credentials: "include", // session
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

  // Accept/reject request
  updateRequestStatus: async (id, action) => {
    try {
      const res = await fetch(`http://localhost:4000/api/requests/${id}/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          requests: state.requests.filter((r) => r._id !== id),
        }));
      }
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },


  // Fetch all user requests (processed)
  fetchAllProcessedRequests: async (emailOrAll) => {
  set({ loading: true, error: null });
  try {
    let url;
    if (emailOrAll === "all") {
      url = "http://localhost:4000/api/requests/processed-all";
    } else {
      if (!emailOrAll) throw new Error("Email is missing");
      url = `http://localhost:4000/api/requests/processed?email=${encodeURIComponent(emailOrAll)}`;
    }

    const res = await fetch(url, { credentials: "include" });
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON but got: ${text}`);
    }

    const data = await res.json();
    set({ processedRequests: data.data || [], loading: false });
  } catch (err) {
    console.error(err);
    set({ error: err.message, loading: false, processedRequests: [] });
  }
},



  // Fetch processed requests by user email
  fetchProcessedRequests: async (email) => {
    set({ loading: true, error: null });
    try {
      if (!email) throw new Error("Email is missing");

      const res = await fetch(
        `http://localhost:4000/api/requests/processed?email=${encodeURIComponent(email)}`,
        { credentials: "include" } // using session
      );

      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got: ${text}`);
      }

      const data = await res.json();
      set({ processedRequests: data.data || [], loading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, loading: false, processedRequests: [] });
    }
  },



  fetchAcceptedChartData: async () => {
  set({ loading: true, error: null });
  try {
    const res = await fetch("http://localhost:4000/api/requests/chart-accepted", { credentials: "include" });
    const data = await res.json();
    set({ chartData: data.data || [], loading: false });
  } catch (err) {
    set({ error: err.message, chartData: [], loading: false });
  }
},


}));

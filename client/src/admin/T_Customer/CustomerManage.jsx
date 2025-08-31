// client/src/admin/T_Customer/CustomerManage.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function CustomerManage() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });
  const [busyDelete, setBusyDelete] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const BASE_URL = "http://localhost:4000";

  const fetchAllUsers = async () => {
    const res = await fetch(`${BASE_URL}/api/user/users`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    const json = await res.json();
    return json.data || json;
  };

  const deleteUserById = async (id) => {
    const res = await fetch(`${BASE_URL}/api/user/customerAd/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAllUsers();
        if (mounted) setAllUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter((u) =>
      [u?.name, u?.email, u?.phone, u?.address, u?.age]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [allUsers, query]);

  const openDeleteConfirm = (user) =>
    setConfirm({ open: true, id: user?._id, name: user?.name || "this user" });

  const closeDeleteConfirm = () => setConfirm({ open: false, id: null, name: "" });

  const handleDelete = async () => {
    if (!confirm.id) return;
    setBusyDelete(true);
    const prev = allUsers;
    try {
      // optimistic UI
      setAllUsers((p) => p.filter((u) => u._id !== confirm.id));
      await deleteUserById(confirm.id);
      setNotice({ type: "success", text: `Deleted "${confirm.name}"` });
    } catch (e) {
      // rollback
      setAllUsers(prev);
      setNotice({ type: "error", text: e.message || "Failed to delete user" });
    } finally {
      setBusyDelete(false);
      closeDeleteConfirm();
      setTimeout(() => setNotice({ type: "", text: "" }), 2500);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">View and manage all customer accounts</p>
        </div>
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers by name, email, phone…"
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>

      {notice.text ? (
        <div
          className={`mb-6 rounded-lg px-5 py-4 shadow-sm ${
            notice.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            {notice.type === "success" ? (
              <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notice.text}</span>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading customer data...</p>
        </div>
      ) : err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
          <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-800">Error Loading Customers</h3>
          <p className="mt-2 text-red-600">{err}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No customers found</h3>
          <p className="mt-2 text-gray-600">Try adjusting your search query or check back later.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{u.name || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.email || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.age || "-"}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{u.address || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.isAccountVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openDeleteConfirm(u)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200 font-medium text-sm px-3 py-1.5 rounded-md hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm dialog */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 pl-16">
              Are you sure you want to delete <b>{confirm.name}</b>? All associated data will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 pl-16">
              <button
                onClick={closeDeleteConfirm}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                disabled={busyDelete}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 transition-colors duration-200"
                disabled={busyDelete}
              >
                {busyDelete ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
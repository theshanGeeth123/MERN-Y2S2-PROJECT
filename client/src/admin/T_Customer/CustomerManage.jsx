import React, { useEffect, useMemo, useState } from "react";

export default function CustomerManage() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });
  const [busyDelete, setBusyDelete] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  // details drawer
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const closeDeleteConfirm = () =>
    setConfirm({ open: false, id: null, name: "" });

  const openDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!confirm.id) return;
    setBusyDelete(true);
    const prev = allUsers;
    try {
      // optimistic UI
      setAllUsers((p) => p.filter((u) => u._id !== confirm.id));
      // close drawer if deleting currently viewed user
      if (selectedUser?._id === confirm.id) closeDetails();
      await deleteUserById(confirm.id);
      setNotice({ type: "success", text: `Deleted "${confirm.name}"` });
    } catch (e) {
      setAllUsers(prev); // rollback
      setNotice({ type: "error", text: e.message || "Failed to delete user" });
    } finally {
      setBusyDelete(false);
      closeDeleteConfirm();
      setTimeout(() => setNotice({ type: "", text: "" }), 2500);
    }
  };

  // Helper to render truthy or fallback
  const T = (v, fb = "-") =>
    v === 0 || v === false ? String(v) : v ? String(v) : fb;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Customer Management
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all customer accounts
          </p>
        </div>
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers by name, email, phone…"
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>

      {notice.text ? (
        <div
          className={`mb-6 rounded-lg px-5 py-4 shadow-md ${
            notice.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          } transition-all duration-300`}
        >
          <div className="flex items-start">
            {notice.type === "success" ? (
              <svg
                className="h-5 w-5 text-green-500 mr-3 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-red-500 mr-3 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{notice.text}</span>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-md transition-all duration-300">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading customer data...
          </p>
        </div>
      ) : err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center shadow-md transition-all duration-300">
          <svg
            className="h-12 w-12 text-red-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-red-800">
            Error Loading Customers
          </h3>
          <p className="mt-2 text-red-600">{err}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-md transition-all duration-300">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No customers found
          </h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search query or check back later.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop/tablet view (md and up) */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* MOST WANTED DETAILS ONLY */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((u) => (
                  <tr
                    key={u?._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {T(u?.name)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {T(u?.email)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {T(u?.phone)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u?.isAccountVerified ? (
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
                      {u?.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openDetails(u)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-sm px-3 py-1.5 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(u)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 font-medium text-sm px-3 py-1.5 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view (cards) */}
          <ul className="md:hidden space-y-3">
            {filtered.map((u) => (
              <li
                key={u?._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {T(u?.name)}
                      </h3>
                      {u?.isAccountVerified ? (
                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 break-words">
                      {T(u?.email)}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5 break-words">
                      {T(u?.phone)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created:{" "}
                      <span className="text-gray-700">
                        {u?.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openDetails(u)}
                      className="inline-flex justify-center items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(u)}
                      className="inline-flex justify-center items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* DETAILS SLIDE-OVER */}
      {detailsOpen && selectedUser && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeDetails}
          />
          <aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
            aria-modal="true"
            role="dialog"
          >
            <div className="h-full flex flex-col">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Customer Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Full profile information
                  </p>
                </div>
                <button
                  onClick={closeDetails}
                  className="rounded-md p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-6 overflow-y-auto">
                {/* Status pill */}
                <div className="mb-6">
                  {selectedUser?.isAccountVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Pending Verification
                    </span>
                  )}
                </div>

                {/* Primary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <Info label="Name" value={T(selectedUser?.name)} />
                  <Info label="Email" value={T(selectedUser?.email)} />
                  <Info label="Phone" value={T(selectedUser?.phone)} />
                  <Info label="Age" value={T(selectedUser?.age)} />
                  <Info
                    label="Address"
                    value={T(selectedUser?.address)}
                    className="sm:col-span-2"
                  />
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Info label="User ID" value={T(selectedUser?._id)} />
                  <Info
                    label="Created"
                    value={
                      selectedUser?.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString()
                        : "-"
                    }
                  />
                  <Info
                    label="Updated"
                    value={
                      selectedUser?.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleString()
                        : "-"
                    }
                  />
                  <Info
                    label="Role"
                    value={T(selectedUser?.role || selectedUser?.userType)}
                  />
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Viewing:{" "}
                  <span className="font-medium text-gray-700">
                    {T(selectedUser?.name)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      openDeleteConfirm(selectedUser);
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={closeDetails}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Confirm dialog */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex items-center mb-5">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Customer
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 pl-16">
              Are you sure you want to delete{" "}
              <b className="text-gray-900">{confirm.name}</b>? All associated
              data will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 pl-16">
              <button
                onClick={closeDeleteConfirm}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                disabled={busyDelete}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 transition-colors duration-200 shadow-sm"
                disabled={busyDelete}
              >
                {busyDelete ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Small display component for label/value pairs */
function Info({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">
        {label}
      </span>
      <span className="text-sm text-gray-900 break-words font-normal">
        {value}
      </span>
    </div>
  );
}

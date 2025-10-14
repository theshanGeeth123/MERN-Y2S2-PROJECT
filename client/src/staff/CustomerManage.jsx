import React, { useEffect, useMemo, useState } from "react";
  import NavBarStaff from "../components/NavbarStaff";

export default function CustomerManage() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });
  const [busyDelete, setBusyDelete] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });



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

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = allUsers;

    if (q) {
      filtered = allUsers.filter((u) =>
        [u?.name, u?.email, u?.phone, u?.address, u?.age]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [allUsers, query, sortConfig]);

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
      setAllUsers((p) => p.filter((u) => u._id !== confirm.id));

      if (selectedUser?._id === confirm.id) closeDetails();
      await deleteUserById(confirm.id);
      setNotice({ type: "success", text: `Deleted "${confirm.name}"` });
    } catch (e) {
      setAllUsers(prev);
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
    <>
    <NavBarStaff/>
  
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 2xl:mx-20 xl:mx-15">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Customer Management
              </h1>
              <p className="mt-2 text-gray-600">
                View and manage all customer accounts
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-80">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                  className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <a href="/admin/user-reports">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-900 hover:shadow-lg sm:w-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  User Report
                </button>
              </a>
            </div>
          </div>

          {notice.text && (
            <div
              className={`mb-6 rounded-xl border px-5 py-4 shadow-md transition-all duration-300 ${
                notice.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-start">
                {notice.type === "success" ? (
                  <svg
                    className="mr-3 mt-0.5 h-5 w-5 text-green-500"
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
                    className="mr-3 mt-0.5 h-5 w-5 text-red-500"
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
          )}

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-md transition-all duration-300">
              <div className="flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="mt-4 font-medium text-gray-600">
                Loading customer data...
              </p>
            </div>
          ) : err ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center shadow-md transition-all duration-300">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
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
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-md transition-all duration-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
                {query ? "No matching customers found" : "No customers found"}
              </h3>
              <p className="mt-2 text-gray-600">
                {query
                  ? "Try adjusting your search query"
                  : "Check back later when customers have registered"}
              </p>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
             
              <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 md:block">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredAndSorted.length}
                    </span>{" "}
                    customers
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSortConfig({ key: null, direction: "ascending" })
                      }
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Clear Sort
                    </button>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Name
                          {sortConfig.key === "name" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`ml-1 h-4 w-4 ${
                                sortConfig.direction === "ascending"
                                  ? ""
                                  : "rotate-180"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center">
                          Email
                          {sortConfig.key === "email" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`ml-1 h-4 w-4 ${
                                sortConfig.direction === "ascending"
                                  ? ""
                                  : "rotate-180"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("phone")}
                      >
                        <div className="flex items-center">
                          Phone
                          {sortConfig.key === "phone" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`ml-1 h-4 w-4 ${
                                sortConfig.direction === "ascending"
                                  ? ""
                                  : "rotate-180"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("isAccountVerified")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortConfig.key === "isAccountVerified" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`ml-1 h-4 w-4 ${
                                sortConfig.direction === "ascending"
                                  ? ""
                                  : "rotate-180"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center">
                          Created
                          {sortConfig.key === "createdAt" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`ml-1 h-4 w-4 ${
                                sortConfig.direction === "ascending"
                                  ? ""
                                  : "rotate-180"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAndSorted.map((u) => (
                      <tr
                        key={u?._id}
                        className="transition-colors duration-200 hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {T(u?.name)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                          {T(u?.email)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                          {T(u?.phone)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {u?.isAccountVerified ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                          {u?.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openDetails(u)}
                              className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(u)}
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view (cards) */}
              <ul className="space-y-4 md:hidden">
                {filteredAndSorted.map((u) => (
                  <li
                    key={u?._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-gray-900">
                            {T(u?.name)}
                          </h3>
                          {u?.isAccountVerified ? (
                            <span className="shrink-0 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="shrink-0 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="mt-1 break-words text-sm text-gray-600">
                          {T(u?.email)}
                        </p>
                        <p className="mt-0.5 break-words text-sm text-gray-600">
                          {T(u?.phone)}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
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
                          className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(u)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                className="fixed bottom-0 right-0 top-0 z-50 w-full transform transition-transform duration-300 ease-in-out sm:max-w-lg"
                aria-modal="true"
                role="dialog"
              >
                <div className="flex h-full flex-col bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Customer Details
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Full profile information
                      </p>
                    </div>
                    <button
                      onClick={closeDetails}
                      className="rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Close"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Status pill */}
                    <div className="mb-6">
                      {selectedUser?.isAccountVerified ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          Verified Account
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                          Pending Verification
                        </span>
                      )}
                    </div>

                    {/* Primary */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* <Info label="User ID" value={T(selectedUser?._id)} /> */}
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
                      {/* <Info
                      label="Role"
                      value={T(selectedUser?.role || selectedUser?.userType)}
                    /> */}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-5">
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
                          closeDetails();
                        }}
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={closeDetails}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              <div className="w-full max-w-md scale-100 transform rounded-2xl bg-white p-6 opacity-100 shadow-xl transition-all duration-300">
                <div className="mb-5 flex items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
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
                    <p className="mt-1 text-sm text-gray-500">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <p className="mb-6 pl-16 text-gray-700">
                  Are you sure you want to delete{" "}
                  <b className="text-gray-900">{confirm.name}</b>? All
                  associated data will be permanently removed.
                </p>
                <div className="flex items-center justify-end gap-3 pl-16">
                  <button
                    onClick={closeDeleteConfirm}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    disabled={busyDelete}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
                    disabled={busyDelete}
                  >
                    {busyDelete ? (
                      <span className="flex items-center">
                        <svg
                          className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
      </div>
    </>
  );
}

/** Small display component for label/value pairs */
function Info({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="break-words text-sm font-normal text-gray-900">
        {value}
      </span>
    </div>
  );
}

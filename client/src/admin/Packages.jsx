import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000/api/packages";

// Images for each package
const packageImages = {
  "Portrait Photography Package": "https://i.postimg.cc/d1Zzc7vD/Whats-App-Image-2025-09-02-at-09-55-18.jpg",
  "Engagement Photoshoot Package": "https://i.postimg.cc/3NMz8KJ1/Whats-App-Image-2025-09-02-at-09-55-18-2.jpg",
  "Baby Photoshoot Package": "https://i.postimg.cc/Jh29FNf9/Whats-App-Image-2025-09-02-at-09-55-14.jpg",
  "Gold Wedding Package": "https://i.postimg.cc/d01bnHx2/Whats-App-Image-2025-09-02-at-09-55-18-1.jpg",
  "Standard Event Photography Package": "https://i.postimg.cc/BnMWT9MZ/Whats-App-Image-2025-09-02-at-09-55-19.jpg",
};

function Packages() {
  const [packages, setPackages] = useState([]);
  const [displayPackages, setDisplayPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, { withCredentials: true });
      const data = res?.data?.data || res?.data || [];
      if (!Array.isArray(data)) {
        toast.error("Invalid data format from server");
        setPackages([]);
        setDisplayPackages([]);
        return;
      }
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPackages(sorted);
      setDisplayPackages(sorted);
      setQ("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
      toast.success("Package deleted");
      fetchPackages();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting package");
    }
  };

  const handleSearch = () => {
    const term = q.trim().toLowerCase();
    const filtered = packages.filter(
      (p) => !term || (p.title && p.title.toLowerCase().includes(term))
    );
    setDisplayPackages(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <button
            onClick={fetchPackages}
            className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition font-bold self-start sm:self-auto"
          >
            <FiRefreshCw className="h-4 w-4" /> Refresh
          </button>

          <h1 className="text-4xl font-extrabold text-blue-900 text-center flex-1">
            Photography Packages
          </h1>

          <button
            onClick={() => navigate("/packageCreate")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition font-bold"
          >
            <FiPlus className="h-5 w-5" /> New Package
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-14">
          <div className="flex gap-2 w-full max-w-md">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title..."
              className="flex-grow px-4 py-2 rounded-full border border-gray-300 font-bold focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition font-bold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center text-gray-500">Loading packages...</div>
        ) : displayPackages.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">No packages found.</div>
        ) : (
          <div
            className={`grid gap-12 ${
              displayPackages.length === 1
                ? "grid-cols-1 justify-items-center"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {displayPackages.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between package-item transition transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer space-y-4 w-full max-w-sm hover:bg-black hover:text-white"
              >
                <div className="space-y-2 flex flex-col items-center">
                  {/* Package Image */}
                  <img
                    src={packageImages[p.title] || "https://via.placeholder.com/150"}
                    alt={p.title || "Package Image"}
                    className="h-36 w-36 object-cover rounded-lg mb-2"
                  />
                  {/* Package Title & Description */}
                  <h2 className="text-xl font-bold text-center">{p.title || "Untitled Package"}</h2>
                  <p className="font-bold line-clamp-3 text-center">{p.description || "No description"}</p>

                  <div className="flex gap-2">
                    {p.price != null && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs hover:bg-yellow-700 hover:text-white">
                        Rs. {p.price}
                      </span>
                    )}
                    {p.duration && (
                      <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs hover:bg-teal-700 hover:text-white">
                        {p.duration} Hours
                      </span>
                    )}
                  </div>

                  {/* Features displayed safely with commas */}
                  {p.features && (
                    <p className="text-sm font-bold">
                      {Array.isArray(p.features)
                        ? p.features.join(", ")
                        : p.features.toString()}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between gap-2">
                  <button
                    onClick={() => navigate(`/packageDetail/${p._id}`)}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
                  >
                    <FiEdit className="h-4 w-4" /> Update
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-bold"
                  >
                    <FiTrash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Packages;

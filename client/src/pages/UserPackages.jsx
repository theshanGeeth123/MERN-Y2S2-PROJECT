import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:4000/api/packages"; 

const packageImages = {
  "Portrait Photography Package":
    "https://i.postimg.cc/d1Zzc7vD/Whats-App-Image-2025-09-02-at-09-55-18.jpg",
  "Engagement Photoshoot Package":
    "https://i.postimg.cc/3NMz8KJ1/Whats-App-Image-2025-09-02-at-09-55-18-2.jpg",
  "Baby Photoshoot Package":
    "https://i.postimg.cc/Jh29FNf9/Whats-App-Image-2025-09-02-at-09-55-14.jpg",
  "Gold Wedding Package":
    "https://i.postimg.cc/d01bnHx2/Whats-App-Image-2025-09-55-18-1.jpg",
  "Standard Event Photography Package":
    "https://i.postimg.cc/BnMWT9MZ/Whats-App-Image-2025-09-55-19.jpg",
};

function UserPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, { withCredentials: true });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setPackages(data);
    } catch (err) {
      console.error("Error fetching packages:", err);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  
  const handleBooking = (packageItem) => {
    
    toast.success(`You booked: ${packageItem.title}`);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading packages...</p>
    );
  if (!packages.length)
    return (
      <p className="text-center mt-10 text-gray-400">No packages found.</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-black mb-12">
          Explore Packages
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {packages.map((p) => (
            <div
              key={p._id || p.title}
              className="bg-gray-100 rounded-xl shadow-md flex flex-col hover:shadow-lg hover:bg-gray-200 transform hover:-translate-y-1 transition w-60 md:w-80"
            >
              <div className="w-full h-55 overflow-hidden rounded-t-xl bg-gray-200">
                <img
                  src={packageImages[p.title] || "https://via.placeholder.com/300x200"}
                  alt={p.title}
                  className="w-full h-full object-contain rounded-t-xl"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="space-y-2 flex-grow">
                  <h2 className="text-lg font-bold text-black">{p.title}</h2>
                  <p className="text-gray-800 text-sm line-clamp-3">{p.description}</p>

                  {p.price != null && (
                    <div>
                      <label className="font-bold text-black-700 text-sm">Price:</label>
                      <p className="text-gray-800 text-sm">Rs. {p.price}</p>
                    </div>
                  )}

                  {p.duration && (
                    <div>
                      <label className="font-bold text-black-700 text-sm">Duration:</label>
                      <p className="text-gray-800 text-sm">{p.duration} hrs</p>
                    </div>
                  )}

                  {p.features && (
                    <div>
                      <label className="font-bold text-black-700 text-sm">Features:</label>
                      <p className="text-gray-800 text-sm">
                        {Array.isArray(p.features) ? p.features.join(", ") : p.features}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleBooking(p)}
                    className="w-full py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPackages;

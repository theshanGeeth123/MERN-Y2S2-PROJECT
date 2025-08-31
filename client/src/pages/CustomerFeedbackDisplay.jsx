import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from 'axios';
import { toast } from "react-toastify";
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';

function CustomerFeedbackDisplay() {
  const { userData } = useContext(AppContent);
  if (!userData) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Loading user data...</h1>
      </div>
    );
  }
  const username = userData.name;
  const email = userData.email;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await axios.get(`http://localhost:4000/api/user/feedback?email=${email}`);
        if (data.status=="200") {
          setFeedbacks(Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || []);
        }
        toast.error(data.message);
      } catch (e) {
        toast.error("Error occurred "+ e);
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="text-4xl font-bold text-left mb-6">Previous Feedbacks</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
            You haven’t submitted any feedback yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <li key={fb._id} className="rounded-2xl bg-white p-5 shadow-sm flex flex-col border border-gray-200
                      ring-1 ring-gray-300 hover:ring-gray-400 hover:shadow-md transition" >
                  <div className="grow">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-lg font-semibold"> {fb.selectedPhotographer} </h3>
                    </div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700">
                        {fb.rate} </span>
                      {fb.email && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"> {fb.email} </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-gray-800">
                      {fb.comment}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 flex justify-end gap-2">
                    <button  onClick={() => onEdit(fb)}
                      className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Edit </button>
                    <button onClick={() => onDelete(fb._id)}
                      className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                      Delete </button>
                  </div>

              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default CustomerFeedbackDisplay;

import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import SwAdminNavbar from './SwAdminNavbar';
import NavbarAdmin from '../components/NavbarAdmin';

function AdminFeedbackHandler() {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { // load data
    loadAllFeedbacks();
  }, []);

  const loadAllFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`http://localhost:4000/api/user/feedback`);
      if (data.status=="200") {
         let feedbackList = Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || [];
         feedbackList.reverse();
         setFeedbacks(feedbackList);
      } else {
         toast.error(data.message);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Error occurred: " + e);
    }
  };

  const deleteFeedback = async (id) => { // delete the selected feedback
    if (!window.confirm("Delete this feedback")) return;
    try {
      const data = await axios.delete(`http://localhost:4000/api/user/feedback?id=${id}`);
      if (data.status=="200") {
        toast.success("Successfully deleted the feedback");
        setFeedbacks(prev => prev.filter(fb => fb._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error occurred: " + e);
    }
  };

  return (
    <>
    <NavbarAdmin />

    <div className="min-h-screen flex flex-col bg-green-50">
  
      <div className="w-full max-w-7xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl">
        <h3 className="text-4xl font-bold text-left mb-6">Feedbacks</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              No feedbacks yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-2xl overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Photographer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Comment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Created/Last Updated Time</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {feedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-800 font-medium"> {fb.selectedPhotographer} </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className={`w-5 h-5 transition-colors duration-200 
                                ${ index < fb.rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}/>))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-pre-wrap"> {fb.comment} </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-pre-wrap"> {new Date(fb.createdAt).toISOString().split('T')[0]} </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => deleteFeedback(fb._id)} className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                              Delete </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
    </>
  );
}

export default AdminFeedbackHandler;

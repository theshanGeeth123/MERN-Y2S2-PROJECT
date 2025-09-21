import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import CustomerFeedbackModal from "./CustomerFeedbackModal";

function CustomerFeedbackDisplay({ loading, feedbacks, updatedFb, deletedFb}) {
  const [feedback, setFeedback] = useState(null);
  const [open, setOpen] = useState(false);

  const deleteFeedback = async (id) => { // delete the selected feedback
    if (!window.confirm("Delete this feedback")) return;
    try {
      const data = await axios.delete(`http://localhost:4000/api/user/feedback?id=${id}`);
      if (data.status=="200") {
         toast.success("Successfully deleted the feedback");
         deletedFb?.(id); // pass updated feedback to UI after deleting feedback
      } else {
         toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error occurred: " + e);
    }
  };

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
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-yellow-700">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <button type="button"  key={index} onClick={() => handleRating(index)} className="focus:outline-none">
                            <Star className={`w-5 h-5 transition-colors duration-200 ${ index < fb.rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300" }`}/>
                          </button>
                        ))}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-medium text-gray-800"> {fb.comment} </p>
                    <div> <p className="whitespace-pre-wrap text-sm text-gray-400 text-right">
                      {fb.updatedAt !== undefined ? `Updated on: ${new Date(fb.updatedAt).toISOString().split('T')[0]}`
                          : `Created on: ${new Date(fb.createdAt).toISOString().split('T')[0]}`}
                    </p></div>
                  </div>

                  <div className="mt-4 pt-3 flex justify-end gap-2">
                    <button  onClick={() => { setOpen(true); setFeedback(fb)}} // Open modal to update selected feedback
                      className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Edit </button>
                    <button onClick={() => deleteFeedback(fb._id)} // delete selected feedback
                      className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                      Delete </button>
                  </div>
              </li>
            ))}
          </ul>
        )}
        <CustomerFeedbackModal open={open} onClose={() => setOpen(false)} 
          feedback={feedback} updatedFb={updatedFb}></CustomerFeedbackModal>
    </div>
  );
}

export default CustomerFeedbackDisplay;

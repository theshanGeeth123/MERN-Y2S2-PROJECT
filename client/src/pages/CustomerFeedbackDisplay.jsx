import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Star, Calendar, Clock, Edit3, Trash2 } from "lucide-react";
import CustomerFeedbackModal from "./CustomerFeedbackModal";

function CustomerFeedbackDisplay({ loading, feedbacks, updatedFb, deletedFb}) {
  const [feedback, setFeedback] = useState(null);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

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

  const formatDate = (d) => {
      new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const fromNow = (d) => {
    const ms = Date.now() - new Date(d).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <section className="mt-10">
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="mb-4 text-xl font-semibold text-gray-600">Submitted Feedbacks</h2>
        <div className="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          {feedbacks && feedbacks.length > 0 && (
            <p className="text-gray-600 text-sm">
              Total Feedbacks: {feedbacks.length}
            </p>
          )}
        </div>
      </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No feedbacks yet, share your experience.
          </div>
        ) : (
          <ul className="space-y-3">
            {feedbacks.map((fb) => {
              let isExpanded = expandedId === fb._id;
              return (
                <li className="group rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 shadow-sm
                  ring-1 ring-gray-100 transition hover:shadow-md hover:ring-blue-200">

                      <div className="mb-5 flex items-start justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{fb.selectedPhotographer} </h3>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-yellow-700">
                         {Array.from({ length: 5 }).map((_, index) => (
                           <button type="button"  key={index} onClick={() => handleRating(index)} className="focus:outline-none">
                             <Star className={`w-5 h-5 transition-colors duration-200 ${ index < fb.rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300" }`}/>
                           </button>
                         ))}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-1 text-[15px] leading-relaxed text-gray-600">
                        <span>
                          {fb.comment.length < 100 ? fb.comment : (expandedId==fb._id ? fb.comment : fb.comment.slice(0, 100) + "...")}
                        </span>
                        {fb.comment?.length >= 100 && (
                          <button type="button" onClick={() => setExpandedId(isExpanded ? null : fb._id)}
                            className="text-sm font-medium text-blue-700 hover:underline focus:outline-none"
                            aria-label={expandedId ? "Show less" : "Show more"} >
                          {expandedId==fb._id ? "Show less" : "Show more"} </button>
                        )}
                      </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5" title={formatDate(fb.createdAt)}>
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">Created: {fromNow(fb.createdAt)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-5">
                        {fb.updatedAt && fb.updatedAt != fb.createdAt && (
                          <span className="flex items-center gap-1.5" title={formatDate(fb.updatedAt)}>
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Updated: {fromNow(fb.updatedAt)}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setOpen(true); setFeedback(fb)}} // Open modal to update selected feedback
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-400 to-violet-400
                          px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500
                          active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 transition"
                          aria-label={`Edit feedback for ${fb.selectedPhotographer}`}>
                          <Edit3 className="h-4 w-4" /> Edit</button>
                        <button  type="button" onClick={() => deleteFeedback(fb._id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-red-300
                          px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-rose-500 hover:to-red-500
                          active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition"
                          aria-label={`Delete feedback for ${fb.selectedPhotographer}`} >
                          <Trash2 className="h-4 w-4" /> Delete </button>
                      </div>
                    </div>
                </li>
              )
            })}
          </ul>
        )}
        <CustomerFeedbackModal open={open} onClose={() => setOpen(false)} 
          feedback={feedback} updatedFb={updatedFb}></CustomerFeedbackModal>
    </section>
  );
}

export default CustomerFeedbackDisplay;

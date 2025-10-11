import React, { useContext, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { Star } from "lucide-react";

function CustomerFeedbackModal ({ open, onClose, feedback, updatedFb, children }) {
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const id = feedback?._id || null;
  const [selectedPhotographer, setSelectedPhotographer] = useState("");
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open && feedback) {
      setSelectedPhotographer(feedback.selectedPhotographer ?? "");
      setRate(feedback.rate ?? 0);
      setComment(feedback.comment ?? "");
    }
  }, [open, feedback]);
  if (!open) return null;

  const onUpdateFeedbackHandler = async (e) => { // update the selected feedback
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/user/feedback?id=${id}`, {
        username: feedback.username, email: feedback.email, selectedPhotographer, rate, comment
      });
      if (res.data.success) {
        toast.success("Feedback is updated successfully");
        updatedFb?.(res.data.data || res.data); // pass updated feedback to UI after updating selected feedback
        onClose?.();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error occurred: " + err);
    }
  };

  const handleRating = (index) => { // update stars when rating
    setRate(index + 1);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" onClick={onClose}/>
      <div ref={dialogRef} role="dialog" aria-modal="true"
        className="relative z-[1001] w-full max-w-4xl rounded-3xl bg-white p-12 shadow-2xl
             border border-gray-200">

        <h3 className="mb-4 text-xl font-semibold text-gray-800">Update Feedback</h3>

        <form onSubmit={onUpdateFeedbackHandler} className="space-y-4">
          <div><label className="mb-2 block text-sm text-gray-700"> Selected Photographer </label></div>
          <div class="mt-2">
            <input name="photographer" type="text" value={selectedPhotographer} required onChange={(e) => setSelectedPhotographer(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 outline-none ring-1 ring-transparent cursor-not-allowed
                focus:border-gray-300 focus:ring-0"/>
          </div>
          <div><label className="mb-2 block text-sm text-gray-700"> Rating </label></div>
          <div className="flex space-x-4 mt-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <button type="button"  key={index} onClick={() => handleRating(index)} className="focus:outline-none">
                  <Star className={`w-9 h-9 transition-colors duration-200 ${ index < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300" }`}/>
                </button>
              ))}
          </div>
          <div><label className="mb-2 block text-sm font-medium text-gray-700"> Comment </label></div>
          <div className="mt-3">
              <textarea name="comment" rows="4" placeholder="Write a few words." value={comment} required onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
          </div>
          <div className="mt-4 flex justify-end flex gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
                px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-violet-500
                active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2
                transition-all duration-200 ease-in-out">Update</button>
            <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600
                px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-black hover:to-gray-800
                active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                transition-all duration-200 ease-in-out">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFeedbackModal;

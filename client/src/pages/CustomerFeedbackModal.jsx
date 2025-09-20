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
        className="relative z-[1001] w-[26rem] max-w-[92%] rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-4xl font-bold text-left mb-6">Update Feedback</h3>
        <form onSubmit={onUpdateFeedbackHandler} className="space-y-4">
          <label className="mb-1 block text-sm text-gray-700"> Selected photographer </label>
          <div class="mt-2">
            <input name="photographer" type="text" value={selectedPhotographer} required onChange={(e) => setSelectedPhotographer(e.target.value)}
                className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
          </div>
          <label className="mb-1 block text-sm text-gray-700"> Rating </label>
          <div class="flex space-x-4 mt-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <button type="button"  key={index} onClick={() => handleRating(index)} className="focus:outline-none">
                  <Star className={`w-12 h-12 transition-colors duration-200 ${ index < rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300" }`}/>
                </button>
              ))}
          </div>
          <label lassName="mb-1 block text-sm text-gray-700"> Comment </label>
          <div class="mt-2">
              <textarea name="comment" rows="4" placeholder="Write a few words." value={comment} required onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
          </div>
          <div className="mt-4 flex justify-end flex gap-3">
            <button type="submit"
                className="rounded-md cursor-pointer hover:bg-black bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Update</button>
            <button type="button" onClick={onClose}
                className="rounded-md cursor-pointer hover:bg-black bg-red-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFeedbackModal;

import React, { useContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import CustomerFeedbackCreation from "./CustomerFeedbackCreation";

function CustomerFeedbackEdit() {
  const { state } = useLocation();
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const feedback = state?.feedback || null;
  const id = state?.id || feedback?._id || null;

  const [selectedPhotographer, setSelectedPhotographer] = useState(feedback?.selectedPhotographer);
  const [rate, setRate] = useState(feedback?.rate);
  const [comment, setComment] = useState(feedback?.comment);

  const onUpdateFeedbackHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/user/feedback?id=${id}`, {
        username: feedback.username, email: feedback.email, selectedPhotographer, rate, comment
      });
      if (res.data.success) {
        toast.success("Feedback is updated successfully");
        navigate('/customer-feedback');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error occurred: " + err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="text-4xl font-bold text-left mb-6">Update Feedback</h3>
      <form onSubmit={onUpdateFeedbackHandler} className="space-y-4">
        <label className="mb-1 block text-sm text-gray-700"> Selected photographer </label>
        <div class="mt-2">
          <input name="photographer" type="text" value={selectedPhotographer} required onChange={(e) => setSelectedPhotographer(e.target.value)}
              className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
        </div>
        <label className="mb-1 block text-sm text-gray-700"> Rating </label>
        <div class="mt-2">
            <select name="rate" defaultValue="Excellent" value={rate} required onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10">
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Okay">Okay</option>
              <option value="Poor">Poor</option>
            </select>
        </div>
        <label lassName="mb-1 block text-sm text-gray-700"> Comment </label>
        <div class="mt-2">
            <textarea name="comment" rows="4" placeholder="Write a few words." value={comment} required onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
        </div>
        <div className="mt-4 flex justify-end flex gap-3">
          <button type="submit"
              className="rounded-md cursor-pointer hover:bg-black bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Update</button>
          <button type="button" onClick={() => navigate("/customer-feedback")}
              className="rounded-md cursor-pointer hover:bg-black bg-red-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CustomerFeedbackEdit;

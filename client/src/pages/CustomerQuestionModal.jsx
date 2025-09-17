import React, { useContext, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

function CustomerQuestionModal ({ open, onClose, question, updatedQuestion, children }) {
  const dialogRef = useRef(null);
  const id = question?._id || null;
  const [askedQuestion, setAskedQuestion] = useState("");
  const [status, setStatus] = useState("Open");

  useEffect(() => {
    if (open && question) {
      setAskedQuestion(question.question ?? "");
      setStatus(question.status ?? "Open");
    }
  }, [open, question]);
  if (!open) return null;

  const onUpdateQuestionHandler = async (e) => { // update the selected question
    e.preventDefault();
    try {
      console.log(askedQuestion);
      const res = await axios.put(`http://localhost:4000/api/user/question?id=${id}`, {
        username: question.username, email: question.email, question: askedQuestion, status: status
      });
      if (res.data.success) {
        toast.success("Question is updated successfully");
        updatedQuestion?.(res.data.data || res.data); // pass updated question to UI after updating selected question
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
        <h3 className="text-4xl font-bold text-left mb-6">Update Question</h3>
        <form onSubmit={onUpdateQuestionHandler} className="space-y-4">
          <label className="mb-1 block text-sm text-gray-700"> Asked Question </label>
          <div class="mt-2">
            <input name="photographer" type="text" value={askedQuestion} required onChange={(e) => setAskedQuestion(e.target.value)}
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

export default CustomerQuestionModal;

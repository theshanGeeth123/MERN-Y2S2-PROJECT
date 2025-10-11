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

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" onClick={onClose}/>
      <div ref={dialogRef} role="dialog" aria-modal="true"
        className="relative z-[1001] w-full max-w-4xl rounded-3xl bg-white p-12 shadow-2xl
             border border-gray-200">
        <h3 className="text-4xl font-bold text-left mb-6">Update Question</h3>
        <form onSubmit={onUpdateQuestionHandler} className="space-y-4">
          <label className="mb-1 block text-sm text-gray-700"> Asked Question </label>
          <div class="mt-2">
            <textarea name="askedQuestion" type="text" value={askedQuestion} required onChange={(e) => setAskedQuestion(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-10 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"/>
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

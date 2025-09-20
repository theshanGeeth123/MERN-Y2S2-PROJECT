import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import CustomerQuestionModal from "./CustomerQuestionModal";

function CustomerQuestionDisplay({ loading, questions, updatedQuestion, deletedQuestion}) {
  const [question, setQuestion] = useState(null);
  const [open, setOpen] = useState(false);

  const deleteQuestion = async (id) => { // delete the selected question
    if (!window.confirm("Delete this questiion")) return;
    try {
      const data = await axios.delete(`http://localhost:4000/api/user/question?id=${id}`);
      if (data.status=="200") {
         toast.success("Successfully deleted the question");
         deletedQuestion?.(id); // pass updated question to UI after deleting question
      } else {
         toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error occurred: " + e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="text-4xl font-bold text-left mb-6">Previous Q&A</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
            You haven’t submitted any questions yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {questions.map((q) => (
              <li key={q._id} className="rounded-2xl bg-white p-5 shadow-sm flex flex-col border border-gray-200
                      ring-1 ring-gray-300 hover:ring-gray-400 hover:shadow-md transition" >
                  <div className="grow">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="whitespace-pre-wrap text-gray-800"> Question: {" "} {q.question} </p>
                    </div>
                    {q.answer && (
                      <div className="mb-1 flex items-center justify-between">
                        <p className="whitespace-pre-wrap text-gray-800"> Answer: {" "} {q.answer} </p>
                      </div>
                    )}
                  </div>
                  {q.status == "Open" && (
                    <div className="mt-4 pt-3 flex justify-end gap-2">
                      <button  onClick={() => { setOpen(true); setQuestion(q)}} // Open modal to update selected question
                        className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Edit </button>
                      <button onClick={() => deleteQuestion(q._id)} // delete selected question
                        className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                        Delete </button>
                    </div>
                  )}
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-sm text-gray-400"><span>Asked on:</span>{" "}{new Date(q.createdAt).toLocaleDateString()}</p>
                  </div>
              </li>
            ))}
          </ul>
        )}
        <CustomerQuestionModal open={open} onClose={() => setOpen(false)} 
          question={question} updatedQuestion={updatedQuestion}></CustomerQuestionModal>
    </div>
  );
}

export default CustomerQuestionDisplay;

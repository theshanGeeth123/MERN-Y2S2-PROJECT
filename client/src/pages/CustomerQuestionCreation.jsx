import React, { useContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

function CustomerQuestionCreation({ userData, createdQuestion }) {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('Open'); // Set Open since question is not answered yet
  const username = userData.name;
  const email = userData.email;
  

  if (!userData) {
    return (
      <div className="text-center mt-10">
        return <Navigate to="/login" replace state={{ from: useLocation() }} />;
      </div>
    );
  }

  const setInitial = () => {
    setQuestion("");
    setStatus("Open");
  }

  const onSubmitQuestionHandler = async (e) => { // ask a new question
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/api/user/question', {
          username, email, question, status
      });
      if (data.success) {
        toast.success("You have successfully submitted your question");
        createdQuestion?.(data.data || data); // pass created feedback to fetching list in UI
        setInitial();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="text-4xl font-bold text-center mb-6">Ask a Question</h3>
      <form onSubmit={onSubmitQuestionHandler} className="space-y-4">
        <label lassName="mb-1 block text-sm text-gray-700"> Question </label>
        <div class="mt-2">
          <textarea name="question" rows="4" placeholder="Write your question" value={question} required onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
        </div>
        <div class="mt-2">
          <button type="submit" class="rounded-md cursor-pointer hover:bg-black bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default CustomerQuestionCreation;

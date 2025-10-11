import { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { SendHorizonalIcon } from "lucide-react";

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
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-xl font-semibold text-gray-600">Ask a Question</h2>
      <p className="mb-5 text-sm text-gray-500">
        Keep it clear and concise so we can answer quickly.
      </p>
      <form onSubmit={onSubmitQuestionHandler} className="space-y-4">
        <div><label className="mb-2 block text-sm font-medium text-gray-700"> Question </label></div>
        <div className="flex justify-end">
          <textarea name="question" rows="4" placeholder="Write your question" value={question} required onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-10 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"/>
        </div>
        <div class="mt-2">
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500
            px-6 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-blue-600
            active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2">
           Submit</button>
        </div>
      </form>
    </section>
  );
}

export default CustomerQuestionCreation;

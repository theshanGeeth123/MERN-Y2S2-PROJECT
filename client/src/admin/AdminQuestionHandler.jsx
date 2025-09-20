import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import SwAdminNavbar from './SwAdminNavbar';
import NavbarAdmin from '../components/NavbarAdmin';

function AdminQuestionHandler() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditAnswer, setIsEditAnswer] = useState(false);

  useEffect(() => { // load data
    loadAllQuestions();
  }, []);

  const loadAllQuestions = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`http://localhost:4000/api/user/question`);
      if (data.status=="200") {
         let questionList = Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || [];
         questionList.reverse();
         setQuestions(questionList);
      } else {
         toast.error(data.message);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Error occurred: " + e);
    }
  };

  const addEditAnswer = (question) => {
    setSelectedQuestion(question);
    setAnswer(question.answer);
    setIsModalOpen(true);
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      toast.error("Fill the answer first");
      return;
    }
    try {
      const res = await axios.put(`http://localhost:4000/api/user/question-answer?id=${selectedQuestion._id}`, {
        username: selectedQuestion.username, email: selectedQuestion.email, answer, status: "Closed"
      });
      if (res.status === 200) {
        toast.success("Answer submitted successfully!");
        setQuestions(prev =>  prev.map(q => q._id === selectedQuestion._id ? { ...q, answer } : q ) );
        setIsModalOpen(false);
      } else {
        toast.error(res.data.message || "Failed to submit answer");
      }
    } catch (error) {
      toast.error("Error occurred: " + error.message);
    }
  };

  const deleteQuestion = async (id) => { // delete the selected question
    if (!window.confirm("Delete this question?")) return;
    try {
      const data = await axios.delete(`http://localhost:4000/api/user/question?id=${id}`);
      if (data.status=="200") {
        toast.success("Successfully deleted the question");
        setQuestions(prev => prev.filter(fb => fb._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error occurred: " + e);
    }
  };

  return (

    <>
    <NavbarAdmin />

    <div className="min-h-screen flex flex-col bg-green-50">
      
      <div className="w-full max-w-7xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl">
        <h3 className="text-4xl font-bold text-left mb-6">Questions</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              No Questions yet
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              No Questions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-2xl overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Username</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Question</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-100">Created Time</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-2/5 text-gray-100 ">Response</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {questions.map((qa) => (
                      <tr key={qa._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-800 font-medium"> {qa.username} </td>
                        <td className="px-4 py-3 text-gray-800 font-medium"> {qa.question} </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">  {new Date(qa.createdAt).toISOString().split('T')[0]} </td>
                        <td className="px-4 py-3 text-gray-800 font-medium text-center"> 
                          {qa.answer != undefined ? (
                            <span>{qa.answer}</span>
                          ) : (
                            <button className="bg-green-400 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => addEditAnswer(qa)}>
                              Add Answer </button>
                          )} 
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button  onClick={() => { setIsEditAnswer(true); addEditAnswer(qa)}} className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                              Edit </button>
                            <button onClick={() => deleteQuestion(qa._id)} className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                              Delete </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" onClick={() => setIsModalOpen(false)}/>
          <div role="dialog" aria-modal="true" className="relative z-[1001] w-[26rem] max-w-[92%] rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{isEditAnswer ? "Edit Response" : "Add Response"}</h3>
            <p className="mb-4 text-gray-700"> {selectedQuestion?.question} </p>
            <textarea className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="4"
              placeholder="Type answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>  Cancel </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={submitAnswer}> Submit </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default AdminQuestionHandler;

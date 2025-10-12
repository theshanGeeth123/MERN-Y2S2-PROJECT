import React, { useMemo, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { CheckCircle2, Clock} from "lucide-react";
import NavbarAdmin from '../components/NavbarAdmin';

function AdminQuestionHandler() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditAnswer, setIsEditAnswer] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

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

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const answered = q.status === "Closed";
      if (statusFilter === "answered") return answered;
      if (statusFilter === "awaiting") return !answered;
      return true; // "all"
    });
  }, [questions, statusFilter]);

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

    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-6 pt-10">
        {/* Header */}
        <div className="flex mb-5 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Q&A Management</h1>
            <p className="mt-1 text-gray-500">View and manage all customer questions.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            {questions && questions.length > 0 && (
              <p className="text-gray-600 text-sm"> Total Questions: {questions.length} </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-600">  Filter by status: </label>
              <select  id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800
                          shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                <option value="all">All</option>
                <option value="awaiting">Awaiting reply</option>
                <option value="answered">Answered</option>
              </select>
            </div>
          </div>
        </div>
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
            <div className="overflow-x-auto mt-2 rounded-2xl">
              <div className="rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
                <div className="hidden overflow-hidden border border-gray-200 bg-white shadow-lg transition-all duration-300 md:block">
                  <table className="min-w-full">
                    <thead className="bg-gray-200 mb-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-5 py-3 w-1/15">Status</th>
                        <th className="px-5 py-3 w-2/15">Created on</th>
                        <th className="px-5 py-3 w-3/15">Username</th>
                        <th className="px-5 py-3 w-4/15">Question</th>
                        <th className="px-5 py-3 w-4/15">Response</th>
                        <th className="px-5 py-3 w-2/15">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filtered.map((qa) => (
                          <tr key={qa._id} className="hover:bg-gray-50 transition font-sm">
                            <td className="px-4 py-3 text-gray-800">
                              {qa.answer && qa.answer.trim() !== "" ? (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Answered
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                                  <Clock className="h-4 w-4 text-amber-500" /> Open
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4">  {new Date(qa.createdAt).toISOString().split('T')[0]} </td>
                            <td className="px-5 py-4"> {qa.username} </td>
                            <td className="px-5 py-4"> {qa.question} </td>
                            <td className="px-4 py-3 text-gray-800">
                              <span>{qa.answer}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                {qa.answer != undefined ? (
                                  <div className="mt-4 pt-3 flex justify-end gap-2 border-gray-200">
                                    <button  onClick={() => { setIsEditAnswer(true); addEditAnswer(qa)}} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2
                                      text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-200 transition whitespace-nowrap">
                                      Edit Answer</button>
                                    <button onClick={() => deleteQuestion(qa._id)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2
                                      text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-200 transition whitespace-nowrap">
                                      Delete Record</button>
                                  </div>
                                ) : (
                                  <div className="mt-4 pt-3 flex justify-end gap-2 border-gray-200">
                                    <button  onClick={() => addEditAnswer(qa)} className="inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2
                                      text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-200 hover:bg-green-200 transition whitespace-nowrap">
                                      Add Answer </button>
                                    <button onClick={() => deleteQuestion(qa._id)}  className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2
                                      text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-200 transition whitespace-nowrap">
                                      Delete Record</button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"  onClick={() => setIsModalOpen(false)}/>
          <div role="dialog" aria-modal="true" className="relative z-[1001] w-full max-w-4xl rounded-3xl bg-white p-12 shadow-2xl
             border border-gray-200">
            <h3 className="text-xl font-bold mb-4">{isEditAnswer ? "Edit Answer" : "Add Answer"}</h3>
            <p className="mb-4 text-gray-700"> {selectedQuestion?.question} </p>
            <textarea className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="4"
              placeholder="Type answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <div className="mt-4 flex justify-end gap-2">
              {selectedQuestion?.answer != undefined ? (
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={submitAnswer}> Update </button>
              ) : (
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={submitAnswer}> Submit </button>
              )}
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>  Cancel </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default AdminQuestionHandler;

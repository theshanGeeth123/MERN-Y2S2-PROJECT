import React, { useMemo, useState } from "react";
import axios from 'axios';
import { Calendar, Edit3, Trash2, CheckCircle2, ClockIcon, Search } from "lucide-react";
import { toast } from "react-toastify";
import CustomerQuestionModal from "./CustomerQuestionModal";

function CustomerQuestionDisplay({ loading, questions, updatedQuestion, deletedQuestion}) {
  const [question, setQuestion] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'awaiting', 'answered'

  const isAnswered = (q) => !!q.answer || q.status === "Answered";

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

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      // Filter by status
      if (statusFilter === "answered" && !isAnswered(q)) return false;
      if (statusFilter === "awaiting" && isAnswered(q)) return false;

      // Filter by text search (question + answer)
      if (!query.trim())  return true;
      const t = query.toLowerCase();
      return ( q.question?.toLowerCase().includes(t) || q.answer?.toLowerCase().includes(t));
    });
  }, [questions, statusFilter, query]);

  const formatDate = (d) => {
      new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const fromNow = (d) => {
    const ms = Date.now() - new Date(d).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <section className="mt-10">
      <div className="mt-2 mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="mb-4 text-xl font-semibold text-gray-600">Asked Questions</h2>
        <div className="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          {questions && questions.length > 0 && (
            <p className="text-gray-600 text-sm">
              Total Questions: {questions.length}
            </p>
          )}
        </div>
      </div>
      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search" className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm
                      outline-none ring-1 ring-transparent focus:border-indigo-400 focus:ring-indigo-100"/>
        </div>
      </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
            You haven’t submitted any questions yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {filtered.map((q) => (
              <li className="group rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 shadow-sm
                  ring-1 ring-gray-100 transition hover:shadow-md hover:ring-blue-200">
                  <div className="mb-4 relative flex flex-col gap-2">
                    {/* Status Chip (top-right corner) */}
                    {(() => {
                      const isAnswered = q.status === "Closed";
                      const chipClass = isAnswered ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-amber-50 text-amber-700 ring-amber-200";
                      const Icon = isAnswered ? CheckCircle2 : ClockIcon;
                      const label = isAnswered ? "Answered" : "Awaiting reply";
                      return (
                        <span className={`absolute right-3 top-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                          text-xs font-semibold ring-1 ring-inset shadow-sm ${chipClass}`} aria-label={`Status: ${label}`}>
                          <Icon className="h-3.5 w-3.5" />  {label}
                        </span>
                      );
                    })()}

                    {/* Question */}
                    <p className="text-gray-900 text-[15px] leading-relaxed pr-28">
                      <span className="font-semibold text-gray-800">Question:</span>{" "}
                      {q.question}
                    </p>

                    {/* Answer (optional) */}
                    {q.answer && (
                      <div className="pl-3 border-l-4 border-indigo-200">
                        <p className="text-gray-700 text-[15px] leading-relaxed">
                          <span className="font-semibold text-indigo-600">Answer:</span>{" "} {q.answer}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-5">
                      <span className="flex items-center gap-1.5" title={formatDate(q.createdAt)}>
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Asked: {fromNow(q.createdAt)}</span>
                      </span>
                    </div>
                    {q.status == "Open" && (
                      <div className="mt-4 pt-3 flex justify-end gap-2">
                        <button  onClick={() => { setOpen(true); setQuestion(q)}} // Open modal to update selected question
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-400 to-violet-400
                          px-6 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500
                          active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 transition">
                          <Edit3 className="h-4 w-4" /> Edit</button>
                        <button onClick={() => deleteQuestion(q._id)} // delete selected question
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-red-300
                          px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-rose-500 hover:to-red-500
                          active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition">
                          <Trash2 className="h-4 w-4" /> Delete </button>
                      </div>
                    )}
                  </div>
              </li>
            ))}
          </ul>
        )}
        <CustomerQuestionModal open={open} onClose={() => setOpen(false)} 
          question={question} updatedQuestion={updatedQuestion}></CustomerQuestionModal>
    </section>
  );
}

export default CustomerQuestionDisplay;

import { useMemo, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Search, FileBarChart, Star} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from '../components/NavbarAdmin';

function AdminFeedbackHandler() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { // load data
    loadAllFeedbacks();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && !selectedRate) return feedbacks;
    return feedbacks.filter(fb => {
      let matchQuery = q && fb.selectedPhotographer?.toLowerCase().includes(q) ;
      let matchRating = selectedRate ? fb.rate == selectedRate : true;
      return ( matchQuery && matchRating ) || (!q && matchRating);
    });
  }, [feedbacks, query, selectedRate]);

  const loadAllFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`http://localhost:4000/api/user/feedback`);
      if (data.status=="200") {
         let feedbackList = Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || [];
         feedbackList.reverse();
         setFeedbacks(feedbackList);
      } else {
         toast.error(data.message);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Error occurred: " + e);
    }
  };

  const deleteFeedback = async (id) => { // delete the selected feedback
    if (!window.confirm("Delete this feedback")) return;
    try {
      const data = await axios.delete(`http://localhost:4000/api/user/feedback?id=${id}`);
      if (data.status=="200") {
        toast.success("Successfully deleted the feedback");
        setFeedbacks(prev => prev.filter(fb => fb._id !== id));
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
          <div className="flex mb-5 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Feedback Management</h1>
              <p className="mt-1 text-gray-500">View and manage all customer feedback.</p>
            </div>

            {/* Toolbar: search + report */}
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button onClick={() => navigate("/admin/feedback-report")} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600/10 px-4 py-2 text-sm font-semibold
                text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-600/20 transition" >
                <FileBarChart className="h-4 w-4" /> Feedback Report
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              {feedbacks && feedbacks.length > 0 && (
                <p className="text-gray-600 text-sm">
                  Total Feedbacks: {feedbacks.length}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 sm:ml-auto">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by photographer…" className="w-full border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm
                  outline-none ring-1 ring-transparent focus:border-indigo-400 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Filter by Rating:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button key={index} type="button" onClick={() => setSelectedRate(index + 1 === selectedRate ? null : index + 1)}
                    className="focus:outline-none" title={`${index + 1} Star${index + 1 > 1 ? "s" : ""}`} >
                    <Star className={`h-5 w-5 transition-colors duration-200 ${
                        index < (selectedRate || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
              No feedbacks yet
            </div>
          ) : (
            <div className="overflow-x-auto mt-2 rounded-2xl">
             <div className="rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
                <div className="hidden overflow-hidden border border-gray-200 bg-white shadow-lg transition-all duration-300 md:block">
                  <table className="min-w-full">
                    <thead className="bg-gray-200 mb-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-5 py-3 w-1/6">Photographer</th>
                        <th className="px-5 py-3 w-2/15">Rate</th>
                        <th className="px-5 py-3 w-2/5">Comment</th>
                        <th className="px-5 py-3 w-40">Created on</th>
                        <th className="px-5 py-3 w-32 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filtered.map((fb) => (
                          <tr key={fb._id} className="hover:bg-gray-50/60 transition">
                            <td className="px-5 py-4 font-medium text-gray-900"> {fb.selectedPhotographer?.split("Photography")[0].trim()} </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star key={index} className={`w-5 h-5 transition-colors duration-200
                                    ${ index < fb.rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}/>))}
                              </div>
                            </td>
                            <td className="px-5 py-4"> {fb.comment} </td>
                            <td className="px-5 py-4 text-gray-600"> {new Date(fb.createdAt).toISOString().split('T')[0]} </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => deleteFeedback(fb._id)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2
                                  text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100 transition">
                                  Delete </button>
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
    </div>
    </>
  );
}

export default AdminFeedbackHandler;

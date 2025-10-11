import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from 'axios';
import { CameraIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomerFeedbackDisplay from './CustomerFeedbackDisplay';
import CustomerFeedbackCreation from './CustomerFeedbackCreation';
import NavbarCustomer from "../components/NavbarCustomer";

function CustomerFeedback() {
  const { userData } = useContext(AppContent);
  if (!userData) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Loading user data...</h1>
      </div>
    );
  }
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { loadData(); }, [userData.email]);

  const loadData = async () => { // update feedback list after adding a new feedback
    setLoading(true);
    const data = await axios.get(`http://localhost:4000/api/user/feedback?email=${userData.email}`);
    if (data.status=="200") {
      let feedbackList = Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || [];
      feedbackList.reverse();
      setFeedbacks(feedbackList);
    }
    setLoading(false);
    toast.error(data.message);
  }

  const handleCreated = async (newFb) => {
    setFeedbacks(prev => [newFb, ...prev]); // in order to update list when creating a new feedback
  }

  const handleDeleted = (id) => {
    setFeedbacks(prev => prev.filter(fb => fb._id !== id));
  };

  const handleUpdated = (updated) => {
    setFeedbacks((prev) => prev.map((fb) => (fb._id === updated._id ? updated : fb)));
  };

  return (

    <> <NavbarCustomer />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Page Header */}
      <div className="inline-flex items-center justify-center text-2xl gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full font-medium mb-3">
        <CameraIcon className="h-8 w-8" /> Feedback Center </div>
      <h1 className="text-4xl font-bold text-gray-900"> Submit & Manage Feedback </h1>
      <p className="mt-2 text-gray-500 text-sm"> Share your experience and review your previous submissions. </p>
      <main className="mx-auto mt-8 w-full max-w-4xl px-4 pb-16">
          <CustomerFeedbackCreation userData={userData} createdFb={handleCreated}/>
          <CustomerFeedbackDisplay loading={loading} feedbacks={feedbacks} updatedFb={handleUpdated} deletedFb={handleDeleted}/>
        </main>
      <br/>
    </div>
    </>
  );
}

export default CustomerFeedback;

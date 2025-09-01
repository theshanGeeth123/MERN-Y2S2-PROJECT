import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';
import CustomerFeedbackDisplay from './CustomerFeedbackDisplay';
import CustomerFeedbackCreation from './CustomerFeedbackCreation';

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

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      <CustomerHomeNavbar />
      <CustomerFeedbackCreation userData={userData} createdFb={handleCreated}/>
      <CustomerFeedbackDisplay loading={loading} feedbacks={feedbacks} deletedFb={handleDeleted}/>
      <br/>
    </div>
  );
}

export default CustomerFeedback;

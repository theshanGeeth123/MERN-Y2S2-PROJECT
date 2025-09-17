import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';
import CustomerQuestionDisplay from './CustomerQuestionDisplay';
import CustomerQuestionCreation from './CustomerQuestionCreation';

function CustomerQuestionsAnswers() {
  
  const { userData } = useContext(AppContent);
  if (!userData) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Loading user data...</h1>
      </div>
    );
  }
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { loadData(); }, [userData.email]);

  const loadData = async () => { // update question list after adding a new question
    setLoading(true);
    const data = await axios.get(`http://localhost:4000/api/user/question?email=${userData.email}`);
    if (data.status=="200") {
      let questionList = Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || [];
      questionList.reverse();
      setQuestions(questionList);
    }
    setLoading(false);
    toast.error(data.message);
  }

  const handleCreated = async (newQ) => {
    setQuestions(prev => [newQ, ...prev]); // in order to update list when creating a new question
  }

  const handleDeleted = (id) => {
    setQuestions(prev => prev.filter(q => q._id !== id));
  };

  const handleUpdated = (updated) => {
    //setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      <CustomerHomeNavbar />
      <CustomerQuestionCreation userData={userData} createdQuestion={handleCreated}/>
      <CustomerQuestionDisplay loading={loading} questions={questions} updatedQuestion={handleUpdated} deletedQuestion={handleDeleted}/>
      <br/>
    </div>
  );
}

export default CustomerQuestionsAnswers;

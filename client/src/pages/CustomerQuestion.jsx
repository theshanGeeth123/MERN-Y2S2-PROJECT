import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import axios from 'axios';
import {  MessageSquareText } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomerQuestionDisplay from './CustomerQuestionDisplay';
import CustomerQuestionCreation from './CustomerQuestionCreation';

import NavbarCustomer from "../components/NavbarCustomer";

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
    setQuestions((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
  };

  return (

    <>

    <NavbarCustomer/>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Page Header */}
      <div className="inline-flex items-center justify-center text-2xl gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full font-medium mb-3">
        <MessageSquareText className="h-7 w-7" /> Q&A Center
      </div>
      <h1 className="text-4xl font-bold text-gray-900"> Ask & Manage Questions </h1>
      <p className="mt-2 text-gray-500 text-sm"> Ask anything and track answers from the team. </p>
      <main className="mx-auto mt-8 w-full max-w-4xl px-4 pb-16">
        <CustomerQuestionCreation userData={userData} createdQuestion={handleCreated}/>
        <CustomerQuestionDisplay loading={loading} questions={questions} updatedQuestion={handleUpdated} deletedQuestion={handleDeleted}/>
      </main>
      <br/>
    </div>

    </>
  );
}

export default CustomerQuestionsAnswers;

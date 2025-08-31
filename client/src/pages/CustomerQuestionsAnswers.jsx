import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';

function CustomerQuestionsAnswers() {
  const { userData } = useContext(AppContent);

  if (!userData) {
    return (
      <div className="text-center mt-10">
        return <Navigate to="/login" replace state={{ from: useLocation() }} />;
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerHomeNavbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-center mb-6">Ask a question</h1>
        <form className="space-y-4">
          <label lassName="mb-1 block text-sm text-gray-700"> Comment </label>
          <div class="mt-2">
              <textarea name="question" rows="4" className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
          </div>
          <div class="mt-2">
            <button type="submit" class="rounded-md cursor-pointer hover:bg-black bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Submit</button>
          </div>
        </form>
        <h5 className="text-4xl font-bold text-center mb-6">Your previous questions and answers</h5>
      </div>
    </div>
  );
}

export default CustomerQuestionsAnswers;

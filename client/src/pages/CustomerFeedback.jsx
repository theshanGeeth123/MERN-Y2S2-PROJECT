import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';

function CustomerFeedback() {
  const { userData } = useContext(AppContent);

  const onSubmitFeedbackHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/api/user/feedback', {
          username, email, selectedPhotographer, rate, comment
      });
      if (data.success) {
        getUserData();
        navigate('/');
        localStorage.setItem("customer", JSON.stringify({ email }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  if (!userData) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Loading user data...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerHomeNavbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-center mb-6">Feedback Form</h1>
        <form onSubmit={onSubmitFeedbackHandler} className="space-y-4">
          <label className="mb-1 block text-sm text-gray-700"> Selected photographer </label>
          <div class="mt-2">
            <input name="photographer" type="text" required className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
          </div>
          <label className="mb-1 block text-sm text-gray-700"> Rating </label>
          <div class="mt-2">
              <select name="rating" defaultValue="5" className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10">
                <option value="5">Excellent</option>
                <option value="4">Good</option>
                <option value="3">Okay</option>
                <option value="2">Poor</option>
                <option value="1">Very Poor</option>
              </select>
          </div>
          <label lassName="mb-1 block text-sm text-gray-700"> Comment </label>
          <div class="mt-2">
              <textarea name="comment" rows="4" placeholder="Write a few words." className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"/>
          </div>
          <div class="mt-2">
            <button type="submit" class="rounded-md cursor-pointer hover:bg-black bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFeedback;

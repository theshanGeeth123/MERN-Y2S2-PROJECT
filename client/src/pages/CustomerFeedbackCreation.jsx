import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Star } from "lucide-react";

function CustomerFeedbackCreation({ userData, createdFb }) {
  const [selectedPhotographer, setSelectedPhotographer] = useState("");
  const [photographers, setPhotographers] = useState([]);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const username = userData.name;
  const email = userData.email;

  const setInitial = () => {
    setSelectedPhotographer("");
    setRate(0);
    setComment("");
  };

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/user/feedback-photographers');
        setPhotographers(data.phographers || []);
      } catch (error) {
        toast.error("Failed to load photographers");
      }
    };
    fetchPhotographers();
  }, []);

  const onSubmitFeedbackHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/feedback",
        {
          username,
          email,
          selectedPhotographer,
          rate,
          comment,
        }
      );
      if (data.success) {
        toast.success("Successfully added a feedback");
        createdFb?.(data.data || data);
        setInitial();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleRating = (index) => {
    setRate(index + 1);
  };

  // 👉 New function to autofill demo data
  const fillDemoData = () => {
    setSelectedPhotographer("John Doe");
    setRate(5);
    setComment(
      "Amazing experience! The photographer was professional and captured beautiful moments."
    );
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-xl font-semibold text-gray-600">Submit Feedback</h2>
      <p className="mb-6 text-sm text-gray-500"> Choose a photographer, rate your experience & add a short comment. </p>
      <form onSubmit={onSubmitFeedbackHandler} className="space-y-5">
        <div><label className="mb-1 block text-sm font-medium text-gray-700"> Select Photographer </label></div>
        <div className="mt-2">
          <div className="mt-2">
          <select value={selectedPhotographer} onChange={(e) => setSelectedPhotographer(e.target.value)} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800
                           outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" >
            <option value="">SELECT</option>
            {photographers.map((p) => (
                <option key={p._id} value={`${p.firstName} ${p.lastName} Photography`}> {`${p.firstName} ${p.lastName} Photography`} </option>
            ))}
          </select>
        </div>
        </div>

        <div><label className="mb-2 block text-sm font-medium text-gray-700"> Rating </label></div>
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleRating(index)}
              className="focus:outline-none"
            >
              <Star
                className={`w-12 h-12 transition-colors duration-200 ${
                  index < rate
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div><label className="mb-2 block text-sm font-medium text-gray-700"> Comment </label></div>
        <div className="mt-2">
          <textarea
            name="comment"
            rows="4"
            placeholder="Write a few words."
            value={comment}
            required
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800
                           outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500
                  px-8 py-4 text-sm font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-blue-600
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            Submit
          </button>

          {/* 👉 Demo Button */}
          <button
            type="button"
            onClick={fillDemoData}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-500
                  px-8 py-4 text-sm font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-blue-600
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            Demo
          </button>
        </div>
      </form>
    </section>
  );
}

export default CustomerFeedbackCreation;

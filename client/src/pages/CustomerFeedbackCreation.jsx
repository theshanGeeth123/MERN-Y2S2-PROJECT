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
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="text-4xl font-bold text-left mb-6">Submit Feedback</h3>
      <form onSubmit={onSubmitFeedbackHandler} className="space-y-4">
        <label className="mb-1 block text-sm text-gray-700">
          Selected photographer
        </label>
        <div className="mt-2">
          <div className="mt-2">
          <select value={selectedPhotographer} onChange={(e) => setSelectedPhotographer(e.target.value)} required className="w-full rounded-xl border border-gray-500 px-3 py-2 text-black
                   outline-none ring-1 ring-transparent shadow-sm transition duration-200 ease-in-out hover:border-black-700" >
            <option value="">SELECT</option>
            {photographers.map((p) => (
                <option key={p._id} value={`${p.firstName} ${p.lastName} Photography`}> {`${p.firstName} ${p.lastName} Photography`} </option>
            ))}
          </select>
        </div>
        </div>

        <label className="mb-1 block text-sm text-gray-700"> Rating </label>
        <div className="flex space-x-4 mt-2">
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

        <label className="mb-1 block text-sm text-gray-700"> Comment </label>
        <div className="mt-2">
          <textarea
            name="comment"
            rows="4"
            placeholder="Write a few words."
            value={comment}
            required
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-gray-500 px-3 py-2 outline-none ring-1 ring-transparent focus:border-gray-900 focus:ring-gray-900/10"
          />
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            className="rounded-md cursor-pointer hover:bg-black bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Submit
          </button>

          {/* 👉 Demo Button */}
          <button
            type="button"
            onClick={fillDemoData}
            className="rounded-md cursor-pointer bg-green-500 hover:bg-green-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Demo
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerFeedbackCreation;

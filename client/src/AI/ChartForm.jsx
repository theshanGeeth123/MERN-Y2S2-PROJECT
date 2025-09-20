import React, { useRef } from "react";
import { IoSend } from "react-icons/io5";

const ChartForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    setChatHistory((h) => [...h, { role: "user", text: userMessage }]);

    setTimeout(() => {
      setChatHistory((h) => [...h, { role: "model", text: "Thinking..." }]);
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `using the details provide above, please address this query: ${userMessage} `,
        },
      ]);
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        required
        className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-300"
      />
      <button
        type="submit"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-black transition hover:bg-gray-50"
        aria-label="Send message"
      >
        <IoSend className="text-xl" />
      </button>
    </form>
  );
};

export default ChartForm;

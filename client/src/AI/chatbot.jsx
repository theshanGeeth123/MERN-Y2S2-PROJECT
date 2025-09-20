import { useState, useEffect, useRef } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChartForm from "./ChartForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "./companyInfo";
import { IoChatbubblesOutline, IoClose, IoChevronDown } from "react-icons/io5";

function Chatbot() {
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", text: JSON.stringify(companyInfo) },
    { role: "model", text: "👋 Hey there!\nHow can I help you today?" },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Failed to fetch response");
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*|__|\*/g, "")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="relative">
      {/* FAB toggler */}
      <button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((p) => !p)}
        className="fixed bottom-4 right-18 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none"
        aria-label={showChatbot ? "Close chatbot" : "Open chatbot"}
      >
        {showChatbot ? <IoClose className="text-2xl" /> : <IoChatbubblesOutline className="text-2xl" />}
      </button>

      {/* Popup */}
      <div
        className={[
          "fixed bottom-24 right-8 z-50 w-[420px] max-w-[92vw] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200",
          showChatbot
            ? "pointer-events-auto opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-95",
          "origin-bottom-right",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-black px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <ChatbotIcon />
            </div>
            <h2 className="text-lg font-semibold text-white">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot(false)}
            className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            aria-label="Minimize"
          >
            <IoChevronDown className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div
          ref={chatBodyRef}
          className="flex h-[420px] flex-col gap-5 overflow-y-auto bg-white px-5 py-6"
        >
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-5 py-4">
          <ChartForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

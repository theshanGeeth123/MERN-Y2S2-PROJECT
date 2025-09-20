import React from "react";
import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  const isBot = chat.role === "model";
  const isError = chat.isError;

  return (
    <div
      className={[
        "message flex items-start gap-3",
        isBot ? "bot-message" : "user-message flex-col items-end",
        isError ? "text-red-600" : "",
      ].join(" ")}
    >
      {isBot && (
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200">
          <ChatbotIcon />
        </div>
      )}

      <p
        className={[
          "message-text whitespace-pre-line break-words px-4 py-2 text-sm",
          isBot
            ? "max-w-[75%] rounded-[13px] rounded-bl-[3px] bg-blue-50 text-gray-800"
            : "max-w-[75%] rounded-[13px] rounded-br-[3px] bg-blue-400 text-white",
          isError ? "!text-red-600 !bg-red-50 !border !border-red-200" : "",
        ].join(" ")}
      >
        {chat.text}
      </p>
    </div>
  );
};

export default ChatMessage;

"use client";

import { marked } from "marked";
import { BsPerson, BsRobot } from "react-icons/bs";

interface MessageProps {
  sender: "user" | "agent";
  text: string;
  loading?: boolean;
}

const Message = ({ sender, text, loading }: MessageProps) => {
  const cleanedText = text.replace(/\n{2,}/g, "\n").trim();

  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-6`}>
      <div className="flex flex-col max-w-2xl space-y-3">
        {/* Message Header */}
        <div className={`flex items-center space-x-2 ${sender === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`p-2 rounded-full ${
            sender === "user" 
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          }`}>
            {sender === "user" ? <BsPerson className="text-sm" /> : <BsRobot className="text-sm" />}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {sender === "user" ? "You" : "Foodie AI"}
          </span>
        </div>

        {/* Message Content */}
        <div
          className={`p-4 rounded-2xl shadow-sm ${
            sender === "user" 
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
              : "bg-white border border-gray-100 text-gray-900"
          }`}
          style={{ whiteSpace: "pre-line" }}
        >
          {loading && sender === "agent" ? (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="dot-typing"></div>
                <div className="dot-typing"></div>
                <div className="dot-typing"></div>
              </div>
              <span className="text-sm opacity-75">Thinking...</span>
            </div>
          ) : sender === "user" ? (
            <div className="font-medium">{cleanedText}</div>
          ) : (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(cleanedText) }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
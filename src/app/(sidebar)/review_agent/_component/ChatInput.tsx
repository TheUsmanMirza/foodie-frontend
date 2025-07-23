"use client";

import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { review_agent } from "@/service/api";

interface ChatInputProps {
  setMessage: React.Dispatch<React.SetStateAction<{ userMessage: string; agentMessage: string; loading: boolean }[]>>;
}

const ChatInput = ({ setMessage }: ChatInputProps) => {
  const [input_data, setInput_data] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input_data.trim() || isLoading) return;

    const userMessage = input_data.trim();
    setInput_data("");
    setIsLoading(true);

    // Add user message
    setMessage((prev) => [
      ...prev,
      { userMessage, agentMessage: "", loading: true },
    ]);

    try {
      const response = await review_agent(input_data);
      
      // Update the last message with agent response
      setMessage((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = {
            userMessage,
            agentMessage: response,
            loading: false,
          };
        }
        return newMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Update the last message with error
      setMessage((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = {
            userMessage,
            agentMessage: "Sorry, I encountered an error. Please try again.",
            loading: false,
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <textarea
          value={input_data}
          onChange={(e) => setInput_data(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about any UK restaurant..."
          className="w-full p-4 pr-16 resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 min-h-[60px] max-h-32"
          rows={1}
          disabled={isLoading}
        />
        
        <button
          onClick={handleSubmit}
          disabled={!input_data.trim() || isLoading}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex space-x-1">
              <div className="dot-typing"></div>
              <div className="dot-typing"></div>
              <div className="dot-typing"></div>
            </div>
          ) : (
            <IoMdSend className="text-xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

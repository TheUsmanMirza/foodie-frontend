"use client";

import { useEffect, useRef } from "react";
import Message from "@/app/(sidebar)/_components/message";
import ChatInput from "@/app/(sidebar)/review_agent/_component/ChatInput";

interface MessageType {
  userMessage: string;
  agentMessage: string;
  loading: boolean;
}

interface ChatModalProps {
  message: MessageType[];
  setMessage: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

const ChatModal = ({ message, setMessage }: ChatModalProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  return (
    <div className="relative flex flex-col h-full max-w-5xl mx-auto">
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {message.map((msg, index) => (
          <div key={index}>
            {/* User Message */}
            <Message
              sender="user"
              text={msg.userMessage}
              loading={false}
            />
            
            {/* Agent Message */}
            {msg.loading ? (
              <Message
                sender="agent"
                text=""
                loading={true}
              />
            ) : (
              msg.agentMessage && (
                <Message
                  sender="agent"
                  text={msg.agentMessage}
                  loading={false}
                />
              )
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <ChatInput setMessage={setMessage} />
      </div>
    </div>
  );
};

export default ChatModal;

"use client";

import { useState } from "react";
import Welcome from "@/app/(sidebar)/_components/welcome";
import ChatModal from "@/app/(sidebar)/review_agent/_component/chatModal";

interface MessageType {
  userMessage: string;
  agentMessage: string;
  loading: boolean;
}

const ReviewAgent = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <div className="h-full">
      {messages.length === 0 ? (
        <Welcome
          setMessage={setMessages}
          title="Review Agent"
          title_message="Get personalized restaurant recommendations and reviews from our AI assistant."
        />
      ) : (
        <ChatModal message={messages} setMessage={setMessages} />
      )}
    </div>
  );
};

export default ReviewAgent;

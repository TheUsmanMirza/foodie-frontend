"use client";

import ChatInput from "@/app/(sidebar)/review_agent/_component/ChatInput";
import { useEffect } from "react";
import { chat_start } from "@/service/api";
import { BsStars, BsChatDots } from "react-icons/bs";

interface Props {
  setMessage: React.Dispatch<React.SetStateAction<{ userMessage: string; agentMessage: string, loading: boolean }[]>>;
  title: string;
  title_message: string;
}

const Welcome = ({ setMessage, title, title_message }: Props) => {
  useEffect(() => {
    const startChat = async () => {
      try {
        await chat_start();
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    startChat();
  }, []);

  const features = [
    {
      icon: BsChatDots,
      title: "Read Reviews",
      description: "Get insights from real customers"
    },
    {
      icon: BsStars,
      title: "AI Insights",
      description: "Smart recommendations for you"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
          {title_message}
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-2xl">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100 hover:scale-105 transition-transform duration-200"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="w-full max-w-2xl">
        <ChatInput setMessage={setMessage} />
      </div>
    </div>
  );
};

export default Welcome;

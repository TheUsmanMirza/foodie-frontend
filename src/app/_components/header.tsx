"use client";

import { useEffect, useState } from "react";
import { get_user_data } from "@/service/api";
import { UserDataType } from "@/types/api";
import { BsPersonCircle } from "react-icons/bs";

const Header = () => {
  const [data, setData] = useState<UserDataType | null>(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await get_user_data();
        setData(response);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetch_data();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
         
        </div>
        
        <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
            <BsPersonCircle className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">
              {data?.name || "Foodie"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

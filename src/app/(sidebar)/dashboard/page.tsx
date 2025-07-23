'use client'
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { get_restaurant_data } from "@/service/api";
import { RestaurantDataResponse } from "@/types/api";
import { BsStar, BsBuilding, BsChatDots, BsTrophy } from "react-icons/bs";

export default function Home() {
  const [data, setData] = useState<RestaurantDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([
    { name: "1 Star", value: 0 },
    { name: "2 Stars", value: 0 },
    { name: "3 Stars", value: 0 },
    { name: "4 Stars", value: 0 },
    { name: "5 Stars", value: 0 },
  ]);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await get_restaurant_data();
        setData(response);
        
        // Create pie data and filter out 0% values
        const rawPieData = [
          { name: "1 Star", value: response.one_stars },
          { name: "2 Stars", value: response.two_stars },
          { name: "3 Stars", value: response.three_stars },
          { name: "4 Stars", value: response.four_stars },
          { name: "5 Stars", value: response.five_stars },
        ];
        
        // Filter out entries with 0 values to prevent overlapping labels
        const filteredPieData = rawPieData.filter(item => item.value > 0);
        setPieData(filteredPieData);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch_data();
  }, []);

  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFD93D", "#A8E6CF"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">Failed to load data.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Restaurant Name",
      value: data.restaurant_name,
      icon: BsBuilding,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Total Reviews",
      value: data.total_review_counts,
      icon: BsChatDots,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Average Rating",
      value: `${data.overall_rating} ⭐`,
      icon: BsStar,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Top Rated Item",
      value: data.cuisine == "NaN" ? "-" : data.cuisine,
      icon: BsTrophy,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="flex w-full h-full gap-6">
      <div className="flex flex-col gap-4 w-[60%] h-full">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="card-modern p-6 hover:scale-105 transition-transform duration-200 flex-1 flex items-center"
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">{stat.title}</h2>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-r ${stat.color} rounded-xl text-white`}>
                  <Icon className="text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full card-modern p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings Breakdown</h2>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg">No rating data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

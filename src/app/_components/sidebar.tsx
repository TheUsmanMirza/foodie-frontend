"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BsHouse, BsStars, BsGear, BsBoxArrowRight } from "react-icons/bs";
import logoImage from "@/assets/images/logo.png";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      icon: BsHouse,
      path: "/dashboard",
    },
    {
      name: "Review Agent",
      icon: BsStars,
      path: "/review_agent",
    },
    {
      name: "Settings",
      icon: BsGear,
      path: "/setting",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-orange-600 to-red-600 text-white h-screen overflow-hidden flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-orange-500/30">
        <div className="flex items-center justify-center">
          <Image
            src={logoImage}
            alt="Foodie Logo"
            width={150}
            height={150}
           
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`text-xl ${isActive ? "text-white" : "text-white/80 group-hover:text-white"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section with Logout */}
      <div className="p-4 border-t border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">User</p>
              <p className="text-white/60 text-xs">user@example.com</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <BsBoxArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

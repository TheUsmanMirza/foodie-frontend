"use client";

import React, { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { login } from "@/service/api";
import Image from "next/image";
import logoImage from "@/assets/images/logo.png";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    both: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { email: "", password: "", both: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email field is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password field is required";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    try {
      setIsButtonDisabled(true);
      await login(formData.email, formData.password);
      router.push("/review_agent");
    } catch (err) {
      newErrors.both = (err as Error).message || "Invalid credentials. Please try again.";
      setErrors(newErrors);
      setIsButtonDisabled(false);
      return;
    }
    setIsButtonDisabled(false);
  };

  return (
    <div 
      className="w-full lg:w-2/3 h-full flex justify-center bg-gradient-to-br from-white to-orange-50 flex-col px-6 sm:px-10 md:px-16 lg:pl-20 py-12"
    >
      <div className="w-full max-w-lg space-y-8 mx-auto lg:mx-0">
        <div 
          className="flex justify-center items-center"
        >
          <Image
            src={logoImage}
            alt="Foodie Logo"
            width={200}
            height={80}
            className="w-48 logo-zoom"
          />
        </div>

        <div
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Sign in to continue your food journey</p>
        </div>

        {errors.both && (
          <div
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <p className="text-red-600 text-sm">{errors.both}</p>
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                className={`input-modern w-full ${
                  errors.email ? "border-red-300 bg-red-50" : ""
                }`}
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p 
                className="text-red-500 text-sm"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`input-modern w-full pr-12 ${
                  errors.password ? "border-red-300 bg-red-50" : ""
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
              </button>
            </div>
            {errors.password && (
              <p 
                className="text-red-500 text-sm"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="text-right">
            <a 
              href="/forget_password" 
              className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          className="text-center"
        >
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <a 
              href="/signup" 
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

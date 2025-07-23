'use client';

import React, { useState } from "react";
import { forget_password } from "@/service/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImage from "@/assets/images/logo.png";
import { BsCheckCircle } from "react-icons/bs";

export default function ForgetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email.trim() == '') {
      setErrors("Email field is required");
      return;
    }
    try {
      setIsButtonDisabled(true);
      await forget_password(formData.email);
      setShowModal(true);
    } catch (err) {
      setError((err as Error).message || "Invalid credentials. Please try again.");
      setIsButtonDisabled(false);
      return;
    }
    setIsButtonDisabled(false);
    setError('');
    setErrors('');
  };

  return (
    <>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <BsCheckCircle className="text-4xl text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Link Sent!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              A password reset email has been sent to{" "}
              <strong className="text-gray-900">{formData.email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="btn-primary w-full py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <div className="w-full lg:w-2/3 h-full flex justify-center bg-gradient-to-br from-white to-orange-50 flex-col px-6 sm:px-10 md:px-16 lg:pl-20 py-12">
        <div className="w-full max-w-lg space-y-8 mx-auto lg:mx-0">
          <div className="flex justify-center items-center">
            <Image
              src={logoImage}
              alt="Foodie Logo"
              width={200}
              height={80}
              className="w-48 logo-zoom"
            />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">No worries! Enter your email and we&apos;ll send you reset instructions</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form 
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                </div>
                <input
                  type="email"
                  className={`input-modern w-full pl-10 ${
                    errors ? "border-red-300 bg-red-50" : ""
                  }`}
                  placeholder="Enter your email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors && (
                <p className="text-red-500 text-sm">
                  {errors}
                </p>
              )}
            </div>

            <button
              disabled={isButtonDisabled}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
            >
              {isButtonDisabled ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <a href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Sign In
              </a>
            </p>
            <p className="text-gray-600 mt-2">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

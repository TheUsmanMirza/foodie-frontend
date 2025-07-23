"use client";

import React, { useState, useEffect } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { reset_password } from "@/service/api";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import logoImage from "@/assets/images/logo.png";
import { BsShieldLock, BsCheckCircle } from "react-icons/bs";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmed_password: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmed_password: "",
    both: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Password validation states
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordUppercaseValid, setPasswordUppercaseValid] = useState(false);
  const [passwordLowercaseValid, setPasswordLowercaseValid] = useState(false);
  const [passwordNumberValid, setPasswordNumberValid] = useState(false);
  const [passwordSpecialCharValid, setPasswordSpecialCharValid] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  useEffect(() => {
    // Password validation
    setPasswordLengthValid(formData.password.length >= 6 && formData.password.length <= 20);
    setPasswordUppercaseValid(/[A-Z]/.test(formData.password));
    setPasswordLowercaseValid(/[a-z]/.test(formData.password));
    setPasswordNumberValid(/[0-9]/.test(formData.password));
    setPasswordSpecialCharValid(/[@$!%*?&]/.test(formData.password));
  }, [formData.password]);

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
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { password: "", confirmed_password: "", both: "" };

    if (!formData.password.trim()) {
      newErrors.password = "Password field is required";
    } else if (!passwordLengthValid || !passwordUppercaseValid || !passwordLowercaseValid || !passwordNumberValid || !passwordSpecialCharValid) {
      newErrors.password = "Password does not meet requirements";
    }

    if (!formData.confirmed_password.trim()) {
      newErrors.confirmed_password = "Confirm password field is required";
    } else if (formData.password !== formData.confirmed_password) {
      newErrors.confirmed_password = "Passwords do not match";
    }

    if (newErrors.password || newErrors.confirmed_password) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsButtonDisabled(true);
      await reset_password(token!, formData.password);
      setSuccess(true);
      setFormData({ password: "", confirmed_password: "" });
      setErrors({ password: "", confirmed_password: "", both: "" });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      newErrors.both = (err as Error).message || "An unexpected error occurred";
      setErrors(newErrors);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <BsCheckCircle className="text-green-600" />
              <p className="text-green-600 text-sm font-medium">Password reset successfully! Redirecting to login...</p>
            </div>
          </div>
        )}

        {errors.both && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{errors.both}</p>
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsShieldLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`input-modern w-full pl-10 pr-12 ${
                  errors.password ? "border-red-300 bg-red-50" : ""
                }`}
                placeholder="Enter your new password"
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
              <p className="text-red-500 text-sm">
                {errors.password}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
              <ul className="space-y-1 text-sm">
                <li className={`flex items-center space-x-2 ${passwordLengthValid ? "text-green-600" : "text-red-500"}`}>
                  <span>{passwordLengthValid ? "✓" : "✗"}</span>
                  <span>6-20 characters long</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordUppercaseValid && passwordLowercaseValid && passwordNumberValid ? "text-green-600" : "text-red-500"}`}>
                  <span>{passwordUppercaseValid && passwordLowercaseValid && passwordNumberValid ? "✓" : "✗"}</span>
                  <span>Uppercase, lowercase & number</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordSpecialCharValid ? "text-green-600" : "text-red-500"}`}>
                  <span>{passwordSpecialCharValid ? "✓" : "✗"}</span>
                  <span>Special character (@$!%*?&)</span>
                </li>
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BsShieldLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmedPassword ? "text" : "password"}
                name="confirmed_password"
                className={`input-modern w-full pl-10 pr-12 ${
                  errors.confirmed_password ? "border-red-300 bg-red-50" : ""
                }`}
                placeholder="Confirm your new password"
                value={formData.confirmed_password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
              >
                {showConfirmedPassword ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
              </button>
            </div>
            {errors.confirmed_password && (
              <p className="text-red-500 text-sm">
                {errors.confirmed_password}
              </p>
            )}
          </div>

          <button
            className={`btn-primary w-full py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200 ${
              !token || isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!token || isButtonDisabled}
          >
            {isButtonDisabled ? "Resetting..." : "Reset Password"}
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
  );
}

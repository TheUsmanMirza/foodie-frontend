"use client";

import { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { change_password } from "@/service/api";
import { BsShieldLock, BsCheckCircle } from "react-icons/bs";

export default function Setting() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isFormValid = Object.entries(formData).every(([, val]) => val.trim() !== "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!isFormValid || !confirmPassword) return;

    if (formData.old_password === formData.new_password) {
      setError("New password and old password should not match");
      return;
    }

    if (formData.new_password !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setIsButtonDisabled(true);
      await change_password(formData);
      setSuccess(true);
      setFormData({ old_password: "", new_password: "" });
      setConfirmPassword("");
      setError("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-6 flex flex-col items-center justify-center">
      <div className="card-modern p-8 w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
              <BsShieldLock className="text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h3>
          <p className="text-gray-600">Update your account password to keep it secure</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <BsCheckCircle className="text-green-600" />
              <p className="text-green-600 text-sm font-medium">Password updated successfully!</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Old Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 
              </div>
              <input
                type={showOld ? "text" : "password"}
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                className="input-modern w-full pl-4 pr-12"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              </div>
              <input
                type={showNew ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="input-modern w-full pl-4 pr-12"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                  setSuccess(false);
                }}
                className="input-modern w-full pl-4 pr-12"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className={`btn-primary w-full py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200 ${
              !isFormValid || !confirmPassword || isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isFormValid || !confirmPassword || isButtonDisabled}
          >
            {isButtonDisabled ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

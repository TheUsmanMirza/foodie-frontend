'use client';

import React, { useEffect, useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { get_restaurant_names, signup, search_restaurant } from "@/service/api";
import { useRouter } from "next/navigation";
import { RestaurantResponseType } from "@/types/api";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    restaurant_id: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmed, setConfirmed] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const passwordLengthValid = formData.password.length >= 6 && formData.password.length <= 20;
  const passwordUppercaseValid = /[A-Z]/.test(formData.password);
  const passwordLowercaseValid = /[a-z]/.test(formData.password);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const passwordNumberValid = /\d/.test(formData.password);
  const passwordSpecialCharValid = /[@$!%*?&]/.test(formData.password);
  const [error, setError] = useState({
    password: "",
  });
  const [restaurantList, setRestaurantList] = useState<RestaurantResponseType[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ name: "", location: "" });
  const [modalErrors, setModalErrors] = useState({ name: "", location: "", general: "" });
  const [modalLoading, setModalLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'restaurant_id' && value === 'search_restaurant') {
      setShowModal(true);
      return;
    }
    
    if (name == 'confirmed_password') {
      setConfirmed(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors("");
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalForm(prev => ({ ...prev, [name]: value }));
    setModalErrors(prev => ({ ...prev, [name]: "", general: "" }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.location.trim()) {
      setModalErrors({
        name: !modalForm.name.trim() ? "Restaurant name is required" : "",
        location: !modalForm.location.trim() ? "Location is required" : "",
        general: ""
      });
      return;
    }
    
    try {
      setModalLoading(true);
      const newRestaurant = await search_restaurant(modalForm.name, modalForm.location);

      setRestaurantList(prev => {
        if (prev.some(r => r.id === newRestaurant.id)) {
          return prev;
        }
        return [...prev, newRestaurant];
      });

      setFormData(prev => ({ ...prev, restaurant_id: newRestaurant.id }));
      setShowModal(false);
      setModalForm({ name: "", location: "" });
      setModalErrors({ name: "", location: "", general: "" });
    } catch (err) {
      console.error("Search restaurant error:", err);
      type ErrorWithMessage = { message?: string; detail?: string };
      const errorObj = err as ErrorWithMessage;
      const errorMessage = typeof err === 'string'
        ? err
        : errorObj.message || errorObj.detail || "Failed to search restaurant. Please try again.";
      setModalErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await get_restaurant_names();
        const data = response;
        setRestaurantList(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmed.trim()) {
      setErrors("Please agree to the terms and conditions.");
      return;
    }
    const newErrors = { password: "", confirmed_password: "" };

    if (!formData.password.trim()) {
      newErrors.password = "This field is required";
    } else if (
      !passwordLengthValid ||
      !passwordUppercaseValid ||
      !passwordLowercaseValid ||
      !passwordNumberValid ||
      !passwordSpecialCharValid
    ) {
      setErrors("Password must meet all criteria.");
      return;
    }

    if (!confirmed.trim()) {
      newErrors.confirmed_password = "This field is required";
    } else if (formData.password !== confirmed) {
      newErrors.confirmed_password = "Passwords do not match";
    }
    if (newErrors.password || newErrors.confirmed_password) {
      if (newErrors.password) {
        setError(newErrors);
      } else {
        setErrors(newErrors.confirmed_password);
      }
      return;
    }
    try {
      setIsButtonDisabled(true);
      await signup(formData);
      router.push('/');
    } catch (err) {
      setErrors((err as Error).message || "Invalid credentials. Please try again.");
      setIsButtonDisabled(false);
      return;
    }
    setIsButtonDisabled(false);
  };

  return (
    <>
      {/* Restaurant Search Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative"
          >
            {modalLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-gray-600 font-medium">Searching restaurant...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
                </div>
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Restaurant</h2>
            {modalErrors.general && (
              <p className="text-red-500 text-sm mb-4">{modalErrors.general}</p>
            )}
            
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Restaurant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={modalForm.name}
                  onChange={handleModalChange}
                  className="input-modern w-full"
                  placeholder="Enter restaurant name"
                  disabled={modalLoading}
                />
                {modalErrors.name && <p className="text-red-500 text-sm mt-1">{modalErrors.name}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={modalForm.location}
                  onChange={handleModalChange}
                  className="input-modern w-full"
                  placeholder="Enter location"
                  disabled={modalLoading}
                />
                {modalErrors.location && <p className="text-red-500 text-sm mt-1">{modalErrors.location}</p>}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors" 
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all" 
                  disabled={modalLoading}
                >
                  {modalLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div 
        className="w-full lg:w-2/3 h-full flex justify-center bg-gradient-to-br from-white to-orange-50 flex-col px-6 sm:px-10 md:px-16 lg:pl-20 py-12"
      >
        <div className="w-full max-w-lg space-y-8 mx-auto lg:mx-0">
          <div
            className="text-3xl font-bold text-gray-900 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Foodie</h2>
            <p className="text-gray-600">Create your account to start exploring restaurants</p>
          </div>

          {errors && (
            <div
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <p className="text-red-600 text-sm">{errors}</p>
            </div>
          )}

          <form 
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="input-modern w-full"
                placeholder="Enter your full name"
                name="name"
                required={true}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="input-modern w-full"
                placeholder="Enter your email"
                name="email"
                required={true}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                className="input-modern w-full"
                placeholder="Enter your phone number"
                name="phone_number"
                required={true}
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Restaurant</label>
              <select
                name="restaurant_id"
                value={formData.restaurant_id}
                required={true}
                onChange={handleChange}
                className="input-modern w-full"
              >
                <option value="" disabled>Select Restaurant</option>
                <option value="search_restaurant" className="text-orange-600 font-medium">
                  🔍 Search Restaurant
                </option>
                {restaurantList.map((restaurant: RestaurantResponseType, idx: number) => (
                  <option value={restaurant.id} key={idx}>{restaurant.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input-modern w-full pr-12"
                    placeholder="Enter your password"
                    required={true}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
                  </button>
                </div>
                {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmed_password"
                    className="input-modern w-full pr-12"
                    placeholder="Confirm your password"
                    required={true}
                    value={confirmed}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && !(
              passwordLengthValid &&
              passwordUppercaseValid &&
              passwordLowercaseValid &&
              passwordNumberValid &&
              passwordSpecialCharValid
            ) && (
              <div
                className="bg-gray-50 rounded-xl p-4 space-y-2"
              >
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

            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!(
                passwordLengthValid &&
                passwordUppercaseValid &&
                passwordLowercaseValid &&
                passwordNumberValid &&
                passwordSpecialCharValid
              ) || isButtonDisabled}
            >
              {isButtonDisabled ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div
            className="text-center"
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

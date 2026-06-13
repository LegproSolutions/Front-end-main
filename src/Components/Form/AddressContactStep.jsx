// AddressContactStep.jsx
import React from "react";

const AddressContactStep = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mr-4">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          Address Information
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Street */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={(e) => handleChange(e, "address")}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your street address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={(e) => handleChange(e, "address")}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your city"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={(e) => handleChange(e, "address")}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your state"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.address.country}
            onChange={(e) => handleChange(e, "address")}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your country"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.address.pincode}
            onChange={(e) => handleChange(e, "address")}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
            placeholder="Enter your pincode"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressContactStep;
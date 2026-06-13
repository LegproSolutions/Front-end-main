// ExperienceStep.jsx
import React from "react";

const ExperienceStep = ({ 
  formData, 
  handleExperienceChange,
  addExperience,
  removeExperience
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mr-4 shrink-0">
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Work Experience</h3>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
      
      {formData.experience.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
            />
          </svg>
          <p className="font-medium text-gray-600">No work experience added yet</p>
          <p className="text-sm text-gray-500">Add your professional experience above</p>
        </div>
      )}

      {formData.experience.map((exp, index) => (
        <div
          key={index}
          className="mb-6 p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">
                  {index + 1}
                </span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                Experience #{index + 1}
              </span>
            </div>
            {formData.experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex items-center space-x-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-sm font-medium">Remove</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, e)}
                className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
                placeholder="e.g. Google, Microsoft, Startup Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Job Position
              </label>
              <input
                type="text"
                name="position"
                value={exp.position}
                onChange={(e) => handleExperienceChange(index, e)}
                className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
                placeholder="e.g. Software Engineer, Product Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, e)}
                className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(index, e)}
                className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if currently working
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Job Description & Responsibilities
              </label>
              <textarea
                name="description"
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, e)}
                className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
                rows="4"
                placeholder="Describe your role, key responsibilities, and major achievements..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceStep;
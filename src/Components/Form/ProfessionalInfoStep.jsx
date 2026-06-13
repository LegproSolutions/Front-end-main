// ProfessionalInfoStep.jsx
import React, { useRef } from "react";
import EducationForm from "./EducationForm";

const ProfessionalInfoStep = ({ 
  formData, 
  setFormData, 
  updateEducationData
}) => {
  const educationFormRef = useRef();

  return (
    <div className="space-y-8">
      {/* Education Section */}
      <EducationForm
        ref={educationFormRef}
        initialEducationData={formData.education}
        updateEducationData={updateEducationData}
      />

      {/* Skills Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center mr-4">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Professional Skills
          </h3>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={formData.skills.join(", ")}
            onChange={(e) => {
              const skills = e.target.value.split(",").map((skill) => skill.trim());
              setFormData((prev) => ({
                ...prev,
                skills,
              }));
            }}
            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
            placeholder="e.g. JavaScript, React, Python, UI/UX Design, Project Management"
          />
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Add your technical and soft skills separated by commas
          </p>
          <div className="flex flex-wrap gap-3">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {skill}
              </span>
            ))}
          </div>
          {formData.skills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="font-medium">No skills added yet</p>
              <p className="text-sm">
                Start adding your professional skills above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mr-4">
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
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Languages</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, { name: "", proficiency: "" }],
              }))
            }
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
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
        
        {formData.languages.map((lang, index) => (
          <div
            key={index}
            className="mb-6 p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <span className="font-bold text-gray-900 text-lg">
                  Language #{index + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    languages: prev.languages.filter((_, i) => i !== index),
                  }))
                }
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  name="name"
                  value={lang.name}
                  onChange={(e) => {
                    const updatedLanguages = [...formData.languages];
                    updatedLanguages[index].name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      languages: updatedLanguages,
                    }));
                  }}
                  className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
                  placeholder="e.g. English, Hindi, Spanish"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Proficiency Level
                </label>
                <select
                  name="proficiency"
                  value={lang.proficiency}
                  onChange={(e) => {
                    const updatedLanguages = [...formData.languages];
                    updatedLanguages[index].proficiency = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      languages: updatedLanguages,
                    }));
                  }}
                  className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 px-4 py-3 transition-all duration-200 hover:border-gray-300"
                >
                  <option value="">Select Proficiency</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
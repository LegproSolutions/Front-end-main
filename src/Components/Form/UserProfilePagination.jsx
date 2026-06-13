// UserProfilePagination.jsx
import React, { useState } from "react";
import PersonalInfoStep from "./PersonalInfoStep";
import AddressContactStep from "./AddressContactStep";
import ExperienceStep from "./ExperienceStep";
import ProfessionalInfoStep from "./ProfessionalInfoStep";

const UserProfilePagination = ({ 
  formData, 
  setFormData, 
  handleChange,
  updateEducationData,
  handleExperienceChange,
  addExperience,
  removeExperience,
  onSubmit,
  loading
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Personal Information",
      description: "Basic personal details",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Address & Contact",
      description: "Location and contact information",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Work Experience",
      description: "Professional work history",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    },
    {
      title: "Education & Skills",
      description: "Education, skills & languages",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Personal Info
        return (
          formData.firstName?.length >= 2 &&
          formData.lastName?.length >= 2 &&
          formData.fatherName?.length >= 2 &&
          formData.gender &&
          formData.dateOfBirth &&
          formData.email &&
          formData.phone?.length === 10 &&
          formData.aadharNumber?.length === 12
        );
      case 1: // Address
        return true; // Address is optional
      case 2: // Experience
        return true; // Experience is optional
      case 3: // Education & Skills
        return true; // Education & Skills are optional
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep 
            formData={formData} 
            handleChange={handleChange} 
          />
        );
      case 1:
        return (
          <AddressContactStep 
            formData={formData} 
            handleChange={handleChange} 
          />
        );
      case 2:
        return (
          <ExperienceStep 
            formData={formData}
            handleExperienceChange={handleExperienceChange}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
        );
      case 3:
        return (
          <ProfessionalInfoStep 
            formData={formData}
            setFormData={setFormData}
            updateEducationData={updateEducationData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  index === currentStep
                    ? "bg-legpro-primary border-legpro-primary text-white"
                    : index < currentStep
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <div className={`text-sm font-medium ${
                  index === currentStep ? "text-legpro-primary" : index < currentStep ? "text-green-600" : "text-gray-400"
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-16 h-0.5 ml-6 ${
                  index < currentStep ? "bg-green-600" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-2 md:px-6 py-3 rounded-xl font-medium flex items-center md:space-x-2 transition-all duration-200 ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-500">
          {currentStep + 1} of {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Profile</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className={`px-2 md:px-6 py-3 rounded-xl font-medium flex items-center md:space-x-2 transition-all duration-200 ${
              !isStepValid(currentStep)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            <span>Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfilePagination;
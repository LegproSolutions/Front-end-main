import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FileText, UserCheck, Shield, Copyright, XCircle, Mail } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                <FileText className="w-6 h-6 text-amber-800" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Terms and Conditions
              </h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Please read these terms carefully before using our platform
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-12">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100 mb-6">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              By accessing or using the <strong className="text-amber-800">Job Mela</strong> platform,
              you agree to be bound by these terms and conditions. Please read them carefully before
              using our services.
            </p>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <UserCheck className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Eligibility
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    You must be at least 18 years old to use our platform. By registering, you confirm
                    that you meet this requirement and have the legal capacity to enter into this agreement.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-amber-800" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    User Responsibilities
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    As a user of Job Mela, you agree to the following responsibilities:
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Accurate Information</h3>
                        <p className="text-gray-600 text-sm">
                          Provide truthful, accurate, and complete information when creating your profile and applying for jobs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">No Fake Profiles</h3>
                        <p className="text-gray-600 text-sm">
                          Do not create or use fake profiles, impersonate others, or misrepresent your identity or qualifications.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Lawful Use</h3>
                        <p className="text-gray-600 text-sm">
                          Not misuse any part of the platform for harmful, illegal, or unauthorized purposes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Account Security</h3>
                        <p className="text-gray-600 text-sm">
                          Maintain the confidentiality of your account credentials and notify us immediately of any unauthorized access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Copyright className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Intellectual Property
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    All content on the platform, including logos, texts, graphics, design elements, and software,
                    is the exclusive property of <strong className="text-amber-800">Job Mela</strong> and is
                    protected by copyright and intellectual property laws.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                    <p className="text-xs text-gray-700">
                      <strong className="text-amber-800">Important:</strong> Content cannot be copied, reproduced,
                      distributed, or reused without explicit written permission from Job Mela.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <XCircle className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Termination
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    We reserve the right to terminate or suspend your access to the platform immediately,
                    without prior notice or liability, if any terms are violated. Upon termination, your
                    right to use the platform will cease immediately.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    If you have any questions about these Terms and Conditions, please contact us at{" "}
                    <a href="mailto:support@jobmela.com" className="text-amber-800 font-medium hover:underline">
                      support@jobmela.com
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Shield, Database, Lock, RefreshCw, Mail, FileText, User, Globe, Eye, Bell } from 'lucide-react';
import { Card, CardContent } from "@/Components/ui/card";

const PrivacyInfo = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-legpro-primary text-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Your privacy is important to us. Learn how we protect your data and respect your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* Introduction Card */}
          <Card className="border-none shadow-lg mb-8">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
               At <strong className="text-[#0F3B7A]">Jobmela</strong>, powered by Legpro Consultants Pvt. Ltd., we value your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Last updated: June 2023
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Information Collection Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-2 bg-legpro-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Database className="w-6 h-6 text-[#0F3B7A]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#0F3B7A] mb-4">
                      Information We Collect
                    </h2>
                    <div className="prose prose-blue max-w-none text-gray-600">
                      <p>
                        We collect various types of information to provide and improve our services to you. The information we collect includes:
                      </p>
                      <ul className="space-y-3 mt-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            <User className="w-5 h-5 text-[#1D5AB9]" />
                          </div>
                          <div>
                            <strong className="text-gray-800">Personal Information:</strong> Name, email address, phone number, and resume when you register or apply for jobs.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            <Globe className="w-5 h-5 text-[#1D5AB9]" />
                          </div>
                          <div>
                            <strong className="text-gray-800">Usage Data:</strong> Information on how you interact with our platform, including pages visited, features used, and time spent.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            <Bell className="w-5 h-5 text-[#1D5AB9]" />
                          </div>
                          <div>
                            <strong className="text-gray-800">Preferences:</strong> Job preferences, career interests, and notification settings to personalize your experience.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Usage Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-2 bg-legpro-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#0F3B7A]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#0F3B7A] mb-4">
                      How We Use Your Information
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We use your information for the following purposes:
                    </p>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg text-[#1D5AB9] mb-3">Job Matching</h3>
                        <p className="text-gray-600">
                          To match you with relevant job opportunities that align with your skills, experience, and preferences.
                        </p>
                      </div>
                      
                      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg text-[#1D5AB9] mb-3">Communication</h3>
                        <p className="text-gray-600">
                          To communicate with you about job opportunities, application status, and platform updates.
                        </p>
                      </div>
                      
                      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg text-[#1D5AB9] mb-3">Service Improvement</h3>
                        <p className="text-gray-600">
                          To improve our services, enhance user experience, and develop new features for the platform.
                        </p>
                      </div>
                      
                      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg text-[#1D5AB9] mb-3">Legal Compliance</h3>
                        <p className="text-gray-600">
                          To comply with legal obligations and protect against fraudulent or illegal activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-2 bg-legpro-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-[#0F3B7A]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#0F3B7A] mb-4">
                      Data Protection
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Your data is securely stored, and we do not sell your information to third parties.
                      We implement appropriate technical and organizational measures to safeguard your
                      personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <div className="flex items-center mb-3">
                        <Eye className="w-5 h-5 text-[#0F3B7A] mr-2" />
                        <h3 className="font-semibold text-lg text-[#0F3B7A]">Our Security Commitment</h3>
                      </div>
                      <p className="text-gray-700">
                        We use industry-standard encryption and security protocols to protect your data at all times.
                        Our security team regularly audits our systems to ensure your information remains protected.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy Changes Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-2 bg-legpro-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-[#0F3B7A]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#0F3B7A] mb-4">
                      Changes to This Policy
                    </h2>
                    <p className="text-gray-600">
                      We may update our Privacy Policy from time to time to reflect changes in our practices
                      or for legal and regulatory reasons. All changes will be posted on this page, and we
                      will notify you of any significant updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-2 bg-legpro-primary"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#0F3B7A]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#0F3B7A] mb-4">
                      Contact Us
                    </h2>
                    <p className="text-gray-600 mb-6">
                      If you have any questions about our Privacy Policy or how we handle your data, please
                      don't hesitate to reach out to our privacy team.
                    </p>
                    <a 
                      href="mailto:support@jobmela.com" 
                      className="inline-flex items-center px-6 py-3 bg-legpro-primary hover:bg-legpro-primary-hover text-white font-medium rounded-md transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Email Our Privacy Team
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Info */}
          <div className="mt-12 mb-16 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Job Mela. All rights reserved.</p>
            <p className="mt-1">This policy is effective as of June 1, 2023.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyInfo;


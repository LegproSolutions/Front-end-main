import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { 
  Cookie, 
  Settings, 
  Eye, 
  Target, 
  Shield, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Check,
  X 
} from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";

const CookiePolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8FAFF]">
        {/* Hero Section */}
        <div className="bg-legpro-primary text-white py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between">
              <div className="flex-shrink-0">
                <div className="bg-white/10 p-6 rounded-full backdrop-blur-sm">
                  <Cookie className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center">
                  Cookie Policy
                </h1>
                <p className="text-lg text-blue-100 max-w-2xl">
                  How we use cookies and how you can control them
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Summary Card */}
          <Card className="mb-10 shadow-md border-l-4 border-l-[#0F3B7A]">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-5 h-5 mr-2 text-[#0F3B7A]" />
                <h2 className="text-xl font-semibold text-[#0F3B7A]">Summary</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy explains how <span className="font-semibold text-[#0F3B7A]">Job Mela</span> uses cookies
                and similar tracking technologies to recognize and remember you when you visit our website. We use cookies to improve your browsing experience,
                analyze site traffic, and personalize content. By continuing to use our website, you consent to our use of cookies as described in this policy.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-2 text-[#0F3B7A]" />
                    <span className="font-medium">Last Updated</span>
                  </div>
                  <p className="text-gray-600">October 13, 2025</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <HelpCircle className="w-4 h-4 mr-2 text-[#0F3B7A]" />
                    <span className="font-medium">Questions?</span>
                  </div>
                  <p className="text-gray-600">Contact privacy@jobmela.com</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Check className="w-4 h-4 mr-2 text-[#0F3B7A]" />
                    <span className="font-medium">Compliance</span>
                  </div>
                  <p className="text-gray-600">GDPR, CCPA & ePrivacy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* What Are Cookies? */}
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-[#E8F0FF] border-b p-6">
                <div className="flex items-center">
                  <div className="bg-[#0F3B7A] p-2 rounded-lg mr-4">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0F3B7A]">
                    What Are Cookies?
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you
                  visit a website. Cookies are widely used by website owners to make their websites work,
                  or to work more efficiently, as well as to provide reporting information and enhance your
                  overall browsing experience.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Cookies set by Job Mela are called "first-party cookies." We also use some cookies that are set by 
                  third parties, which are called "third-party cookies." These cookies may be placed on your device to 
                  enhance your experience, help us understand how our services are being used, or for advertising purposes.
                </p>
              </CardContent>
            </Card>

            {/* How We Use Cookies */}
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-[#E8F0FF] border-b p-6">
                <div className="flex items-center">
                  <div className="bg-[#0F3B7A] p-2 rounded-lg mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0F3B7A]">
                    How We Use Cookies
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We use cookies for several important reasons:
                </p>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#E8F0FF] p-2 rounded-lg mr-3">
                        <Check className="w-4 h-4 text-[#0F3B7A]" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      These cookies are necessary for the website to function properly and cannot be switched off. 
                      They enable core functionality such as security, network management, and account access.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#E8F0FF] p-2 rounded-lg mr-3">
                        <Settings className="w-4 h-4 text-[#0F3B7A]" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Preference Cookies</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      These cookies enable our website to remember information that changes the way the website behaves or looks, 
                      like your preferred language or the region you are in.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#E8F0FF] p-2 rounded-lg mr-3">
                        <Eye className="w-4 h-4 text-[#0F3B7A]" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      These cookies help us understand how visitors interact with our website. They provide information 
                      about metrics such as number of visitors, bounce rate, traffic sources, and more.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#E8F0FF] p-2 rounded-lg mr-3">
                        <Target className="w-4 h-4 text-[#0F3B7A]" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      These cookies track your online activity to help advertisers deliver more relevant job listings and 
                      advertisements. They can share this information with other organizations or advertisers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Your Cookie Choices */}
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-[#E8F0FF] border-b p-6">
                <div className="flex items-center">
                  <div className="bg-[#0F3B7A] p-2 rounded-lg mr-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0F3B7A]">
                    Your Cookie Choices
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  You have the right to decide whether to accept or reject cookies. Here's how you can exercise your choices:
                </p>
                
                <div className="mb-6 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Browser Settings</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Most web browsers allow you to control cookies through their settings preferences. You can typically find 
                    these settings in the "options" or "preferences" menu of your browser.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 text-[#0F3B7A] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Please note that if you choose to reject cookies, you may not be able to use the full functionality of our website.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Cookie Banner</h3>
                  <p className="text-gray-600 text-sm">
                    When you first visit our site, we will show you a cookie banner that allows you to accept or decline 
                    non-essential cookies. You can change your preferences at any time by clicking on the "Cookie Settings" 
                    link in the footer of our website.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Third-Party Tools</h3>
                  <p className="text-gray-600 text-sm">
                    You can opt out of third-party tracking networks using tools like the Digital Advertising Alliance's 
                    WebChoices Tool or the Network Advertising Initiative's Consumer Opt-Out.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Us */}
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-[#E8F0FF] border-b p-6">
                <div className="flex items-center">
                  <div className="bg-[#0F3B7A] p-2 rounded-lg mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0F3B7A]">
                    Contact Us About Cookies
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have any questions about our cookie practices, please contact us at:
                </p>
                
                <div className="bg-[#0F3B7A]/5 rounded-lg p-6 border border-[#0F3B7A]/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0F3B7A] mb-1">Email Us</h3>
                    <p className="text-gray-700">
                      <a href="mailto:privacy@jobmela.com" className="text-[#0F3B7A] hover:underline">privacy@jobmela.com</a>
                    </p>
                  </div>
                  
                  <Separator orientation="vertical" className="h-12 hidden md:block" />
                  
                  <div>
                    <h3 className="font-semibold text-[#0F3B7A] mb-1">Call Us</h3>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                  
                  <Separator orientation="vertical" className="h-12 hidden md:block" />
                  
                  <div>
                    <h3 className="font-semibold text-[#0F3B7A] mb-1">Mail Us</h3>
                    <p className="text-gray-700">123 Job Mela Lane, City, Country</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-10 text-center text-sm text-gray-500">
            <p>Last updated: October 13, 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookiePolicy;


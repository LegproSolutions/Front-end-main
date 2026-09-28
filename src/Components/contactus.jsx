import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Mail, Phone, MapPin, MessageSquare, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";

const ContactUs = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#F8FAFF] py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F3B7A]">Get in Touch</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Have questions about Job Mela? Need help with your account? Our team is here to assist you.
              We aim to respond to all inquiries within 24 business hours.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Information Panel */}
            <Card className="shadow-lg overflow-hidden border-none rounded-2xl">
              <CardHeader className="bg-[#0F3B7A] text-white p-8 text-center">
                <div className="mx-auto bg-white/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-white/80 text-sm mt-1">Reach out to us directly through any of the channels below</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-[#E8F0FF] p-3 rounded-full mb-3 shrink-0">
                    <Mail className="h-6 w-6 text-[#0F3B7A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Us</p>
                    <p className="text-sm text-gray-600">Jobmela@legpro.co.in</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-[#E8F0FF] p-3 rounded-full mb-3 shrink-0">
                    <Phone className="h-6 w-6 text-[#0F3B7A]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-855">Call Us</p>
                    <p className="text-base text-gray-600 mt-1">+91 - 7303086551</p> 
                    <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-[#E8F0FF] p-3 rounded-full mb-3 shrink-0">
                    <MapPin className="h-6 w-6 text-[#0F3B7A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Office Address</p>
                    <p className="text-sm text-gray-600">
                      Job Mela G 005,H36,Sector-63, 
                      <br /> GautamBudh Nagar,
                      <br /> Noida,UP - 201301,India
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800 mb-3">Follow Us</p>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="https://www.linkedin.com/company/legpro-services/" 
                      target="_blank"
                      className="bg-[#E8F0FF] hover:bg-[#D1E3FF] p-3 rounded-full transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-[#0F3B7A]" />
                    </a>
                    <a 
                      target="_blank"
                      href="https://www.instagram.com/jobmela.co/"
                      className="bg-[#E8F0FF] hover:bg-[#D1E3FF] p-3 rounded-full transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-[#0F3B7A]" />
                    </a>
                    <a 
                      target="_blank"
                      href="https://www.facebook.com/profile.php?id=61581203214167"
                      className="bg-[#E8F0FF] hover:bg-[#D1E3FF] p-3 rounded-full transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-[#0F3B7A]" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ section */}
          <div className="mt-16 p-8 bg-white rounded-2xl shadow-md border-none">
            <h2 className="text-2xl font-bold text-[#0F3B7A] mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800">How do I create an account on Job Mela?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click on the "Sign Up" button in the top right corner and follow the simple registration process.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">How can recruiters post job listings?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recruiters can sign up for a company account and access the dashboard to post job listings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Is Job Mela available in multiple languages?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Currently, Job Mela is available in English. We're working on adding more languages soon.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">How do I report an issue with the platform?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You can report issues through this contact form or by emailing support@jobmela.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;



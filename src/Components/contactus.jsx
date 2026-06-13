import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Mail, Phone, MapPin, Send, User, MessageSquare, Clock, Linkedin, Twitter, Globe, Instagram } from 'lucide-react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '', consent: false });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F8FAFF] py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F3B7A]">Get in Touch</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Have questions about Job Mela? Need help with your account? Our team is here to assist you.
              We aim to respond to all inquiries within 24 business hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information Panel */}
            <Card className="lg:col-span-1 shadow-md overflow-hidden">
              <CardHeader className="bg-[#0F3B7A] text-white p-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact Information
                </h2>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#E8F0FF] p-2 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-[#0F3B7A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Us</p>
                    <p className="text-sm text-gray-600">Jobmela@legpro.co.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#E8F0FF] p-2 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-[#0F3B7A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Call Us</p>
                    <p className="text-sm text-gray-600">+91 - 7303086551 </p> 
                    <p className="text-sm text-gray-600">Mon-Sat, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#E8F0FF] p-2 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-[#0F3B7A]" />
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

                <Separator className="my-4" />

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Follow Us</p>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      target="_blank"
                      className="bg-[#E8F0FF] hover:bg-[#D1E3FF] p-2 rounded-full transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-[#0F3B7A]" />
                    </a>
                    <a 
                      target="_blank"
                      href="https://www.instagram.com/jobmela.co/"
                      className="bg-[#E8F0FF] hover:bg-[#D1E3FF] p-2 rounded-full transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-[#0F3B7A]" />
                    </a>
                    <a 
                      target="_blank"
                      href="https://www.facebook.com/profile.php?id=61581203214167"
                      className="bg-[#E8F0FF] hover:bg-[#D1E3FF] p-2 rounded-full transition-colors"
                    >
                      <Globe className="h-5 w-5 text-[#0F3B7A]" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="lg:col-span-2 shadow-md">
              <CardHeader className="p-6 border-b">
                <h2 className="text-xl font-semibold text-[#0F3B7A]">Send us a Message</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe" 
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com" 
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Input 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message
                    </Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Please describe your inquiry in detail..." 
                      className="resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="rounded text-[#0F3B7A]"
                      required
                    />
                    <Label htmlFor="consent" className="text-xs text-gray-600">
                      I consent to Job Mela storing my data to respond to my inquiry
                    </Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-6 bg-gray-50">
                <Button 
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-[#0F3B7A] hover:bg-[#0b2b5a] text-white flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Map or Additional Information - Optional */}
          <div className="mt-16 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#0F3B7A] mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800">How do I create an account on Job Mela?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click on the "Sign Up" button in the top right corner and follow the simple registration process.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">How can recruiters post job listings?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recruiters can sign up for a company account and access the dashboard to post job listings.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Is Job Mela available in multiple languages?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Currently, Job Mela is available in English. We're working on adding more languages soon.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">How do I report an issue with the platform?</h3>
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



import React from "react";
import Navbar from "@/Components/Navbar";
import Hero from "@/Components/Hero";
import PlatformStats from "@/Components/PlatformStats";
import CompanyRibbon from "@/Components/CompanyRibbon";
import JobListing from "@/Components/Jobs/JobListing";
import Footer from "@/Components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Subtle professional background grid texture & gradient */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none -z-10" />

      <Navbar />
      <Hero />
      <PlatformStats />
      <CompanyRibbon />
      <div id="job-listing" className="relative z-10">
        <JobListing />
      </div>
    
      <Footer />
    </div>
  );
};

export default Home;


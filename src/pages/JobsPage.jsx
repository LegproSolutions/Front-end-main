import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import JobListing from "@/Components/Jobs/JobListing";

const JobsPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-4">
        <JobListing />
      </div>
      <Footer />
    </div>
  );
};

export default JobsPage;


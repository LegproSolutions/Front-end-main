import React, { useState, useContext } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Users,
  Building,
  Star,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  UserPlus
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import { JobLocations, assets } from "../assets/assets";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { cn } from "../lib/utils";

const Hero = () => {
  const {
    setSearchFilter,
    setIsSearched,
    homeJobs = [],
    isUserAuthenticated,
    setShowUserLogin,
    setUserLoginState,
  } = useContext(AppContext);

  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [educationInput, setEducationInput] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const educationOptions = [
    "10th",
    "12th",
    "Diploma",
    "Graduate",
    "Post Graduate",
  ];

  const jobTitles = [
    ...new Set(homeJobs.map((job) => job.title).filter(Boolean)),
  ];
  const jobLocations = [
    ...new Set([
      ...homeJobs.map((job) => job.location).filter(Boolean),
      ...JobLocations,
    ]),
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Internship",
  ];

  const handleSearch = () => {
    const searchFilters = {
      title: titleInput,
      location: locationInput,
      education: educationInput,
      jobType: selectedJobType,
    };

    setSearchFilter(searchFilters);
    setIsSearched(true);

    document.querySelector("#job-listing")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };



  return (
    <div className="relative bg-transparent">

      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Section */}
          <div className="space-y-8">

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                Find Your Next <span className="text-legpro-primary">Job Opportunity</span>
              </h1>
              <p className="text-gray-600 text-lg font-semibold">
                Thousands of jobs from trusted employers.
              </p>
            </div>

            {/* Search Card */}
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">

                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Job title or keyword"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-base w-full"
                      list="job-titles"
                    />
                    <datalist id="job-titles">
                      {jobTitles.map((title, index) => (
                        <option key={index} value={title} />
                      ))}
                    </datalist>
                  </div>

                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-base w-full"
                      list="job-locations"
                    />
                    <datalist id="job-locations">
                      {jobLocations.map((location, index) => (
                        <option key={index} value={location} />
                      ))}
                    </datalist>
                  </div>

                  <div className="relative flex-1">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={educationInput}
                      onChange={(e) => setEducationInput(e.target.value)}
                      className="pl-10 h-12 text-base w-full bg-white border border-input rounded-md appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Education</option>
                      {educationOptions.map((edu, index) => (
                        <option key={index} value={edu}>{edu}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  className="w-full h-12 text-base font-semibold bg-legpro-primary hover:bg-legpro-primary-hover text-white"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </Button>
              </div>
            </Card>



            <div className="flex flex-wrap gap-4 items-center">
              <Button
                size="lg"
                className="bg-legpro-primary hover:bg-legpro-primary/90 font-bold"
                onClick={() =>
                  document.querySelector("#job-listing")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Browse All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

          </div>

          {/* Right Section */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl">



              <img
                src="/professional-businesswoman.jpg"
                alt="Indian business professional smiling"
                loading="eager"
                className="w-full max-h-[400px] rounded-3xl shadow-lg border border-gray-100 relative z-0"
              />



            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;


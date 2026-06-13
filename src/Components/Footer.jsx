import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { setShowAdminLogin } = useContext(AppContext);

  return (
    <footer className="bg-white text-gray-800 py-8 px-6 sm:px-12">

  {/* Top Description Section */}
  <div className="container mx-auto mb-8 border-b border-gray-300 pb-6">
    <p className="text-sm md:text-base leading-relaxed text-gray-700">
      Jobmela, powered by Legpro Consultants Pvt. Ltd., goes beyond traditional job platforms. Our mission is to connect ITI, Diploma, and skilled professionals with leading industries, ensuring faster recruitment, quality talent, and a smooth hiring process for both employers and candidates
    </p>
  </div>

  {/* Footer Columns Section */}
  <div className="container mx-auto flex flex-col lg:flex-row items-start justify-between space-y-8 lg:space-y-0">

    {/* Left Section - Logo & Social Media */}

        {/* Left Section - Logo & Social Media */}
        <div className="w-full lg:w-1/3 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div 
            onClick={() => setShowAdminLogin(true)}
            className="mx-auto lg:mx-0 cursor-pointer flex items-center justify-center lg:justify-start space-x-1 group"
          >
            <img
              src={assets.logo}
              alt="Job Mela Logo"
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center lg:justify-start space-x-3">
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61581203214167"
              className="hover:opacity-70 transition"
            >
              <img width={32} src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/jobmela.co/"
              className="hover:opacity-70 transition"
            >
              <img width={32} src={assets.instagram_icon} alt="Instagram" />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/company/job-mela/"
              className="hover:opacity-70 transition"
            >
              <div className="border border-gray-500 p-2.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.452 20.452h-3.554v-5.569c0-1.328-.025-3.039-1.851-3.039-1.851 0-2.134 1.445-2.134 2.938v5.67H9.36V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.599 0 4.264 2.367 4.264 5.451v6.29zM5.337 7.433c-1.144 0-2.067-.925-2.067-2.066 0-1.142.923-2.066 2.067-2.066 1.141 0 2.066.924 2.066 2.066 0 1.141-.925 2.066-2.066 2.066zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.225.792 24 1.771 24h20.451C23.2 24 24 23.225 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-sm text-center sm:text-left">
          {/* About Us */}
          <div>
            <h4 className="font-semibold mb-3 uppercase tracking-wider text-gray-900">
              About Us
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Careers
                </a>
              </li>
              <li>
                <Link to="/ContactUs" className="hover:text-gray-900 transition">
                  Contact Us
                </Link>
              </li>
              <li>

              </li>
            </ul>
          </div>

          

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 uppercase tracking-wider text-gray-900">
              Legal
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  to="/privacypolicy"
                  className="hover:text-gray-900 transition"
                >
                  Privacy Policy
                </Link>
              </li> 
              {/* Terms & Conditions Added */}
    <li>
      <Link to="/termsconditions"
        className="hover:text-gray-900 transition"
        > 
  Terms & Conditions
</Link>

    </li> 
              <li>
                
              </li>
              <li>
                <Link
                  to="/cookiepolicy"
                  className="hover:text-gray-900 transition"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-600 text-sm mt-8 border-t pt-4">
        © {new Date().getFullYear()} Job Mela | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

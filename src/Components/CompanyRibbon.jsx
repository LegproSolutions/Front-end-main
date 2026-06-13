import React from 'react';
import { assets } from '../assets/assets';

const CompanyRibbon = () => {
  const logos = [
    { name: 'UEL', lg: assets.uel_logo },
    { name: 'Veira', lg: assets.veira_logo },
    { name: 'New Holland', lg: assets.new_holland_logo },
    { name: 'Lava', lg: assets.lava_logo },
    { name: 'ITC', lg: assets.itc_logo },
    { name: 'SMR', lg: assets.smr_logo },
    { name: 'Overdrive', lg: assets.overdrive_logo },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] pt-10 pb-20 overflow-hidden mt-0">
      <div className="max-w-[1500px] mx-auto px-4">
        {/* First Bordered Container for Heading - Ultra Premium Pulse Pill */}
        <div className="border border-sky-100 bg-gradient-to-r from-sky-50/50 via-white to-blue-50/50 rounded-full py-2.5 px-6 mb-12 max-w-max mx-auto text-center shadow-[0_4px_20px_-2px_rgba(14,165,233,0.06)] flex items-center justify-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <p className="text-xs font-bold text-[#0369A1] tracking-[0.25em] uppercase">
            Trusted by Industry Leaders
          </p>
        </div>

        {/* Second Bordered Container for Logos - Thick Border Pure White Card with Edge Fades */}
        <div className="border-4 border-[#F1F5F9] bg-[#FFFFFF] rounded-3xl py-14 px-4 shadow-[0_20px_50px_rgba(148,163,184,0.12)] overflow-hidden mx-0 md:mx-2 relative">
          {/* Left Gradient Overlay for Seamless Infinite Sliding */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          {/* Right Gradient Overlay for Seamless Infinite Sliding */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Ribbon Wrapper */}
          <div className="relative group">
            <div className="flex animate-scroll whitespace-nowrap items-center w-max">
              {/* First set of logos */}
              <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
                {logos.map((logo, index) => (
                  <div
                    key={`logo-1-${index}`}
                    className="flex-shrink-0 transition-all duration-300"
                  >
                    <div className="bg-[#F8FAFC] p-6 md:p-8 w-44 md:w-52 h-24 md:h-28 flex items-center justify-center rounded-2xl border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-[0_12px_30px_-5px_rgba(14,165,233,0.12)] hover:-translate-y-1.5 transition-all duration-500">
                      <img
                        src={logo.lg}
                        alt={logo.name}
                        className="max-h-12 md:max-h-14 w-auto object-contain transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Duplicate set for seamless looping */}
              <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
                {logos.map((logo, index) => (
                  <div
                    key={`logo-2-${index}`}
                    className="flex-shrink-0 transition-all duration-300"
                  >
                    <div className="bg-[#F8FAFC] p-6 md:p-8 w-44 md:w-52 h-24 md:h-28 flex items-center justify-center rounded-2xl border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-[0_12px_30px_-5px_rgba(14,165,233,0.12)] hover:-translate-y-1.5 transition-all duration-500">
                      <img
                        src={logo.lg}
                        alt={logo.name}
                        className="max-h-12 md:max-h-14 w-auto object-contain transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRibbon;

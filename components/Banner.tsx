"use client";

import React from "react";

const Banner = () => {
  return (
    <div className="p-4 rounded-2xl bg-[#1F1F2E] shadow-lg border border-gray-800 relative overflow-hidden">
      {/* Background Video (dummy source) */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
      >
        <source src="/path/to/dummy-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full">
        <h1 className="text-white text-xl md:text-xl font-bold mb-2">
          Welcome to Our Platform
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-md ">
          Discover the latest insights, market trends, and analytics all in one place. Analyse your wealth and make better decisions.
        </p>
      </div>
    </div>
  );
};

export default Banner;

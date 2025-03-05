"use client";

import React from "react";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import SpeedIcon from "@mui/icons-material/Speed";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: <LockIcon fontSize="large" />,
      title: "Secure Transactions",
      description:
        "Industry-leading security ensures your assets and data are protected.",
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: "Fast Performance",
      description:
        "Experience lightning-fast trade execution and real-time updates.",
    },
    {
      icon: <CurrencyExchangeIcon fontSize="large" />,
      title: "Low Fees",
      description:
        "Competitive, transparent pricing with no hidden costs or surprise fees.",
    },
    {
      icon: <SupportAgentIcon fontSize="large" />,
      title: "24/7 Support",
      description:
        "Round-the-clock assistance from our experts whenever you need help.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

 
  return (
    <main className="relative overflow-hidden bg-[#0B0D17] text-white">
      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:py-32 md:py-40 lg:py-48 flex items-center justify-center h-screen">

        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6EE2F5] to-[#6457E6] mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            The Future of Crypto Trading
          </motion.h1>
          <motion.p
            className="text-lg text-gray-400 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            Secure, fast, and user-friendly crypto platform designed for everyone.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Link href="/dashboard" passHref>
              <Button
                size="large"
                variant="contained"
                style={{ backgroundColor: "#6457E6", color: "white" }}
              >
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24 z-10 bg-[#0B0D17]">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Key Features
          </motion.h2>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Trade with confidence using our cutting-edge features.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              className="relative p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition-shadow overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900 opacity-0 hover:opacity-20 transition-opacity" />
              <div className="flex flex-col items-center p-4 text-center">
                <div className="mb-4 text-indigo-400 hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feat.title}
                </h3>
                <p className="text-gray-500 mt-2">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 bg-[#0B0D17]">
        <p>
          &copy; {new Date().getFullYear()} CryptoPlatform. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

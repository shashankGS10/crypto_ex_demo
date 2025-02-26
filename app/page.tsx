"use client";

import React from "react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import SpeedIcon from "@mui/icons-material/Speed";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: <LockIcon fontSize="large" />, 
      title: "Secure Transactions",
      description:
        "Industry-leading security ensures your assets and data are protected at all times.",
    },
    {
      icon: <SpeedIcon fontSize="large" />, 
      title: "Fast Performance",
      description:
        "Experience lightning-fast trade execution and real-time updates for timely decisions.",
    },
    {
      icon: <CurrencyExchangeIcon fontSize="large" />, 
      title: "Low Fees",
      description:
        "Enjoy competitive, transparent pricing with no hidden costs or surprise fees.",
    },
    {
      icon: <SupportAgentIcon fontSize="large" />, 
      title: "24/7 Support",
      description:
        "Get round-the-clock assistance from our experts whenever you need help.",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      <HeroHighlight containerClassName="relative px-4 py-24 sm:py-32 sm:h-[45rem] z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl font-extrabold text-black sm:text-5xl md:text-6xl relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the Future of Finance with <Highlight>CryptoPlatform</Highlight>
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Trade and manage your crypto assets with a secure, user-friendly platform designed for everyone.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
          

          <Link href="/dashboard" passHref>
            <Button size="large" variant="contained">Go to Dashboard</Button>
          </Link>
          </motion.div>
        </div>
      </HeroHighlight>
      <section className="relative px-4 py-24 z-10">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-black">Key Features</h2>
          <p className="mt-2 text-gray-400">Trade with confidence using our cutting-edge features.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {features.map((feat, idx) => (
            <CardContainer key={idx} className="group relative p-6 min-h-50  rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-100 opacity-0 group-hover:opacity-20 transition-opacity" />
              <CardBody>
                <CardItem className="flex flex-col items-center p-4 text-center">
                  <div className="mb-4 text-indigo-400 group-hover:scale-110 transition-transform">{feat.icon}</div>
                  <h3 className="text-xl font-semibold text-black dark:text-black">{feat.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{feat.description}</p>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>
    </main>
  );
}

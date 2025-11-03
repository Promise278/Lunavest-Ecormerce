"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Slider() {
  const slides = [
    {
      title: "Limited Time Offer!",
      discount: "Up to 50% OFF!",
      text: "Redefine Your Everyday Style",
      img: "/overhead-view-womans-casual-outfits-removebg-preview.png",
    },
    {
      title: "Trendy Men Collection",
      discount: "Flat 40% OFF!",
      text: "Upgrade Your Wardrobe Today",
      img: "/men-clothes-set-removebg-preview.png",
    },
    {
      title: "New Arrivals 2025",
      discount: "Save Big on Latest Designs",
      text: "Refresh Your Look with Modern Fits",
      img: "/third_bg.png",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-switch every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full bg-white mt-12 overflow-hidden md:px-38 px-2">
      <div className="flex items-center justify-between md:px-32 px-8 bg-gray-50 rounded-xl relative h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col-reverse md:flex-row items-center justify-between w-full absolute inset-0 md:px-32 px-8"
          >
            {/* Text Side */}
            <div className="max-w-lg z-10 md:mb-0 mb-20">
              <p className="text-gray-500 md:text-2xl text-xl mb-2">#Big Fashion Sale</p>
              <h1 className="md:text-6xl text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                {slides[current].title} <br />
                <span className="text-black font-bold italic">{slides[current].discount}</span>
              </h1>
              <p className="text-gray-500 mb-6 text-2xl">{slides[current].text}</p>

              <div className="flex space-x-2 mt-4">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full ${
                      idx === current ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            {/* Product Image */}
            <div className="shrink-0 mt-8 md:mt-0 z-10">
              <Image
                src={slides[current].img}
                alt={slides[current].title}
                width={800}
                height={1650}
                className="rounded-lg object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
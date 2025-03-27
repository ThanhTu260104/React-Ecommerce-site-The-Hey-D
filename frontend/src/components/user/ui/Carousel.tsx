"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-slide
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg mb-8">
      <div
        className="flex transition-transform duration-500 ease-in-out h-[800px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="min-w-full relative">
          <Image
            src="https://images.unsplash.com/photo-1706735733956-deebaf5d001c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Gaming Setup"
            className=" object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 p-20 flex items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Ưu đãi đặc biệt!
              </h2>
              <p className="text-lg text-white">Giảm 30% cho Laptop Gaming</p>
              <button className="mt-4 bg-sky-900 hover:bg-sky-700 px-6 py-2 rounded text-white transition duration-300">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
        <div className="min-w-full relative">
          <Image
            src="https://images.unsplash.com/photo-1706735733956-deebaf5d001c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Laptop"
            className=" object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 p-20 flex items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                PC Workstation
              </h2>
              <p className="text-lg text-white">
                Hiệu năng vượt trội cho công việc
              </p>
              <button className="mt-4 bg-sky-700 hover:bg-blue-600 px-6 py-2 rounded text-white transition duration-300">
                Khám phá
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white z-10"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white z-10"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}

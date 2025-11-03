import React from "react";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex flex-col">
      {/* Main Content Spacer */}
      {/* <div className="flex-1"></div> */}

      {/* Hero Section */}
      <div className="relative bg-gray-600 py-28">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/third_bg.png"
            alt="background"
            width={800}
            height={150}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white italic">
            Lets Shop Beyond Boundaries
          </h1>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 max-w-full">
        <div className="md:px-38 px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  className="w-7 h-7 text-white fill-current"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M14 25c0-4 2-8 6-8s6 4 6 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M20 10a2 2 0 110 4 2 2 0 010-4z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-xl font-semibold">
                  Lunavest<span className="text-gray-500"></span>
                </span>
              </div>
              <p className="text-sm mb-6">Lets Shop Beyond Boundaries</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Youtube className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* BeliBeli Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">LunaVest</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Lunavest
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Career
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mitra Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    B2B Digital
                  </a>
                </li>
              </ul>
            </div>

            {/* Buy Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">Buy</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bill & Top Up
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Lunavest COD
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mitra Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Promo
                  </a>
                </li>
              </ul>
            </div>

            {/* Sell Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">Sell</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Seller Education Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Brand Index
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Register Official Store
                  </a>
                </li>
              </ul>
            </div>

            {/* Guide and Help Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">Guide and Help</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Lunavest Care
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Term and Condition
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mitra
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>© 2025. Lunavest.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

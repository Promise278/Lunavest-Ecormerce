"use client";
import { useState } from "react";
import { Search, Bell, Lock, Heart } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [category, setCategory] = useState("All Category");

  return (
    <nav className="w-full bg-white flex items-center justify-between md:px-38 px-4 py-4 shadow-sm">
      {/* Logo */}
      <Link href='/'>
        <div className="flex items-center gap-2">
           <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            className="w-7 h-7 text-gray-800 fill-current"
          >
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
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
          <span className="text-xl font-semibold">Lunavest<span className="text-gray-500"></span></span>
        </div>
      </Link>

      {/* Search Bar */}
      <div className="md:flex hidden items-center border border-gray-300 rounded-md w-[50%] overflow-hidden">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 bg-gray-50 text-gray-600 text-sm outline-none border-r border-gray-200"
        >
          <option>All Category</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
          <option>Beauty</option>
        </select>

        <div className="flex items-center w-full">
          <Search className="ml-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product or brand here..."
            className="w-full py-2 px-3 text-sm outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="md:flex hidden items-center gap-5">
        <Lock className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition" />
        <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition" />
        <Link href='/liked'><Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition" /></Link>
      </div>
      <div className="flex items-center gap-5">
        <Link href='/pages/signup'><button className="bg-gray-800 rounded-full h-10 w-28 hover:bg-gray-200 hover:text-gray-800 text-white">Sign Up</button></Link>
        <Link href='/pages/signin'><button className="bg-gray-200 rounded-full h-10 w-28 hover:bg-gray-500 hover:text-white text-gray-800">Log in</button></Link>
      </div>
    </nav>
  );
}
"use client";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [category, setCategory] = useState("All Category");
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="w-full bg-white flex items-center justify-between md:px-38 px-4 py-4 shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            className="w-8 h-8 text-indigo-600 fill-current"
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
            <path d="M20 10a2 2 0 110 4 2 2 0 010-4z" fill="currentColor" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Luna<span className="text-indigo-600">Vest</span>
          </span>
        </div>
      </Link>

      {/* Search Bar */}
      <div className="md:flex hidden items-center border border-gray-200 rounded-xl w-[40%] overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 bg-gray-100 text-gray-600 text-sm outline-none border-r border-gray-200 font-medium"
        >
          <option>All Category</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
        </select>

        <div className="flex items-center w-full px-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 px-3 text-sm outline-none bg-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* Icons & Auth */}
      <div className="flex items-center gap-6">
        <div className="md:flex hidden items-center gap-6 text-gray-500">
          <Link href="/stock" title="Stock Management" className="hover:text-indigo-600 transition-colors">
            <PackagePlus className="w-6 h-6" />
          </Link>
          <Link href="/liked" title="Wishlist" className="hover:text-rose-500 transition-colors">
            <Heart className="w-6 h-6" />
          </Link>
        </div>

        <Link href="/checkout" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          )}
        </Link>

        <div className="h-8 w-px bg-gray-200 mx-2 md:block hidden" />

        {user ? (
          <div className="flex items-center gap-3">
            <div className="md:flex hidden flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{user.name}</span>
              <button onClick={handleLogout} className="text-[10px] text-gray-400 hover:text-rose-500 font-bold uppercase tracking-wider">
                Logout
              </button>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/pages/signin" className="text-sm font-bold text-gray-600 hover:text-indigo-600 px-4 py-2">
              Login
            </Link>
            <Link href="/pages/signup" className="bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
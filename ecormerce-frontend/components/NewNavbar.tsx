// import { ShoppingCart, Search, User, Heart, Menu } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import Link from "next/link";

// const Navbar = () => {
//   const [cartCount] = useState(3);

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-20 items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 40 40"
//                   className="w-7 h-7 text-gray-800 fill-current"
//                 >
//                   <circle
//                     cx="20"
//                     cy="20"
//                     r="18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     fill="none"
//                   />
//                   <path
//                     d="M14 25c0-4 2-8 6-8s6 4 6 8"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     fill="none"
//                   />
//                   <path
//                     d="M20 10a2 2 0 110 4 2 2 0 010-4z"
//                     fill="currentColor"
//                   />
//                 </svg>
//               </div>
//               <span className="font-display text-2xl font-bold text-foreground">
//                 LunaVest
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden items-center space-x-8 lg:flex">
//             <a
//               href="/shop"
//               className="text-sm font-medium text-foreground transition-smooth hover:text-primary"
//             >
//               Shop
//             </a>
//             <a
//               href="/collections"
//               className="text-sm font-medium text-foreground transition-smooth hover:text-primary"
//             >
//               Collections
//             </a>
//             <a
//               href="/new-arrivals"
//               className="text-sm font-medium text-foreground transition-smooth hover:text-primary"
//             >
//               New Arrivals
//             </a>
//             <a
//               href="/about"
//               className="text-sm font-medium text-foreground transition-smooth hover:text-primary"
//             >
//               About
//             </a>
//           </div>

//           {/* Search Bar */}
//           <div className="hidden flex-1 max-w-md mx-8 lg:flex">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="search"
//                 placeholder="Search products..."
//                 className="w-full pl-10 bg-secondary border-0 focus-visible:ring-1"
//               />
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center space-x-4">
//             {/* Wishlist */}
//             <button className="hidden sm:flex">
//               <Heart className="h-5 w-5" />
//               <span className="sr-only">Wishlist</span>
//             </button>

//             {/* Cart */}
//             <button className="relative">
//               <ShoppingCart className="h-5 w-5" />
//               {cartCount > 0 && (
//                 <Badge
//                   variant="destructive"
//                   className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
//                 >
//                   {cartCount}
//                 </Badge>
//               )}
//               <span className="sr-only">Shopping cart</span>
//             </button>

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button variant="ghost" size="icon">
//                   <User className="h-5 w-5" />
//                   <span className="sr-only">User menu</span>
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56 bg-popover">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Profile</DropdownMenuItem>
//                 <DropdownMenuItem>Orders</DropdownMenuItem>
//                 <DropdownMenuItem>Wishlist</DropdownMenuItem>
//                 <DropdownMenuItem>Settings</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Logout</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Mobile Menu */}
//             <button className="lg:hidden">
//               <Menu className="h-5 w-5" />
//               <span className="sr-only">Menu</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
"use client";

import { ShoppingCart, Search, User, Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const HomeNavbar = () => {
  const [cartCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  className="w-9 h-9 text-green-500 fill-current"
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
              </div>
              <span className="text-2xl font-bold text-gray-900">LunaVest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 lg:flex">
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              Collections
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-md mx-8 lg:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button className="hidden sm:flex items-center justify-center h-10 w-10 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </button>

            {/* Cart */}
            <button className="relative inline-flex items-center justify-center h-10 w-10 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center justify-center h-10 w-10 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      My Account
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/shop"
              className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/new-arrivals"
              className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-4 pt-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;

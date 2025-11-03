"use client";
import Image from "next/image";
import { Grid2x2 } from "lucide-react";
import Slider from "./Slider";

export default function HeroSection() {
  const categories = [
   { img: "/short-sleeve-black-t-shirt.jpg", label: "T-Shirt" },
    { img: "/jacket.jpg", label: "Jacket" },
    { img: "/jeans-removebg-preview.png", label: "Jeans" },
    { img: "/white-expensive-woman-color-hand-removebg-preview.png", label: "Bag" },
    { img: "/one-black-sneaker-shoe-isolated-white-removebg-preview.png", label: "Shoes" },
    { img: "/classic-watches-interface.png", label: "Watches" },
    { img: "/cap.jpg", label: "Cap" },
    { icon: <Grid2x2 className="w-6 h-6 text-gray-700" />, label: "All Category" },
  ];

  return (
    <section className="w-full bg-white mt-12">
      {/* Hero Banner */}
      <Slider />

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-8 mt-10 bg-white py-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition"
          >
            <div className="w-22 h-22 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-sm hover:shadow-md">
              {cat.img ? (
                <Image
                  src={cat.img}
                  alt={cat.label}
                  width={60}
                  height={80}
                  className="object-contain"
                />
              ) : (
                cat.icon
              )}
            </div>
            <p className="text-sm font-medium">{cat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
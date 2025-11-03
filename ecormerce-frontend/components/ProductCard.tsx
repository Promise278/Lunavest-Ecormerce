"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";

export default function ProductCard() {
  const [liked, setLiked] = useState<number[]>([]);

  const handleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const products = [
    {
      id: 1,
      name: "UrbanEdge Men's Jeans Collection",
      price: "Rp253.000",
      oldPrice: "Rp370.000",
      rating: 4.9,
      sold: "10k+ Sold",
      image: "/jeans.jpg",
    },
    {
      id: 2,
      name: "StreetFlex Denim Pro",
      price: "Rp299.000",
      oldPrice: "Rp420.000",
      rating: 4.8,
      sold: "8k+ Sold",
      image: "/cap.jpg",
    },
    {
      id: 3,
      name: "Classic Fit Jeans",
      price: "Rp215.000",
      oldPrice: "Rp330.000",
      rating: 4.7,
      sold: "12k+ Sold",
      image: "/classic-watches-interface.png",
    },
    {
      id: 4,
      name: "RuggedWear Slim Tapered",
      price: "Rp279.000",
      oldPrice: "Rp390.000",
      rating: 4.9,
      sold: "6k+ Sold",
      image: "/clothing-rack-with-floral-hawaiian-shirts-hangers-hat.jpg",
    },
    {
    id: 5,
    name: "BlueStone Men's Stretch Jeans",
    price: "Rp240.000",
    oldPrice: "Rp360.000",
    rating: 4.8,
    sold: "7k+ Sold",
    image: "/jacket.jpg",
  },
  {
    id: 6,
    name: "DenimCore Everyday Jeans",
    price: "Rp225.000",
    oldPrice: "Rp310.000",
    rating: 4.7,
    sold: "9k+ Sold",
    image: "/men-clothes-set-removebg-preview.png",
  },
  {
    id: 7,
    name: "UrbanFlex Comfort Fit",
    price: "Rp250.000",
    oldPrice: "Rp370.000",
    rating: 4.9,
    sold: "11k+ Sold",
    image: "/one-black-sneaker-shoe-isolated-white-removebg-preview.png",
  },
  {
    id: 8,
    name: "Prime Denim Essentials",
    price: "Rp260.000",
    oldPrice: "Rp380.000",
    rating: 4.8,
    sold: "10k+ Sold",
    image: "/overhead-view-womans-casual-outfits-removebg-preview.png",
  },
  {
    id: 9,
    name: "DarkWash Premium Jeans",
    price: "Rp280.000",
    oldPrice: "Rp400.000",
    rating: 5.0,
    sold: "15k+ Sold",
    image: "/short-sleeve-black-t-shirt.jpg",
  },
  {
    id: 10,
    name: "ToughLine Faded Denim",
    price: "Rp265.000",
    oldPrice: "Rp350.000",
    rating: 4.8,
    sold: "8k+ Sold",
    image: "/white-expensive-woman-color-hand-removebg-preview.png",
  },
  {
    id: 11,
    name: "DenimWorks Relax Fit",
    price: "Rp245.000",
    oldPrice: "Rp310.000",
    rating: 4.7,
    sold: "5k+ Sold",
    image: "/third_bg.png",
  },
  {
    id: 12,
    name: "NightRider Black Denim",
    price: "Rp295.000",
    oldPrice: "Rp420.000",
    rating: 5.0,
    sold: "14k+ Sold",
    image: "/cap.jpg",
  },
  {
    id: 13,
    name: "CasualTone Classic Jeans",
    price: "Rp230.000",
    oldPrice: "Rp340.000",
    rating: 4.6,
    sold: "4k+ Sold",
    image: "/jeans.jpg",
  },
  {
    id: 14,
    name: "EdgeFit Slim Jeans",
    price: "Rp255.000",
    oldPrice: "Rp380.000",
    rating: 4.8,
    sold: "9k+ Sold",
    image: "/clothing-rack-with-floral-hawaiian-shirts-hangers-hat.jpg",
  },
  {
    id: 15,
    name: "VibeWear Distressed Jeans",
    price: "Rp310.000",
    oldPrice: "Rp450.000",
    rating: 4.9,
    sold: "12k+ Sold",
    image: "/one-black-sneaker-shoe-isolated-white-removebg-preview.png",
  },
  {
    id: 16,
    name: "UrbanStyle Modern Denim",
    price: "Rp270.000",
    oldPrice: "Rp390.000",
    rating: 4.8,
    sold: "10k+ Sold",
    image: "/casual-men-short-pants.jpg",
  },
  ];

  return (
    <div className="min-h-screen py-1">
      <div className="ml-38 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-[1500px]">
          {products.map((product) => {
            const isLiked = liked.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Heart Icon */}
                  <button
                    onClick={() => handleLike(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-rose-100 hover:scale-110 transition-all duration-300"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isLiked
                          ? "fill-rose-500 text-rose-500"
                          : "text-gray-700 group-hover:text-rose-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating & Sold */}
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium text-gray-800">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{product.sold}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.oldPrice}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
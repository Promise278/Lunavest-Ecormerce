"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Heart, ShoppingCart, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function LikedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    try {
      const response = await apiFetch<{ success: boolean; data: Product[] }>("/products/liked");
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error: unknown) {
      toast.error("Please login to see your wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
            My Wishlist
          </h1>
          <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-500 border border-gray-100">
            {products.length} Items
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-rose-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2 mb-8">Save items you love here to find them easily later.</p>
            <Link
              href="/"
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all inline-block"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative border border-gray-100 flex flex-col h-full"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image.startsWith("http") ? product.image : `https://lunavest-ecormerce.onrender.com${product.image}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md">
                      <Heart className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors h-10">
                    {product.name}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex flex-col mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        Rp {product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

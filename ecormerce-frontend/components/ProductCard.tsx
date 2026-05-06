"use client"
import React, { useState, useEffect } from "react";
import { Heart, Star, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import { apiFetch, apiPost } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

export default function ProductCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchLikedProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiFetch<{ success: boolean; data: Product[] }>("/products/seeAllproducts");
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedProducts = async () => {
    try {
      const response = await apiFetch<{ success: boolean; data: Product[] }>("/products/liked");
      if (response.success && response.data) {
        setLiked(response.data.map((p: Product) => p.id));
      }
    } catch (error) {
      // Might fail if not logged in, ignore
    }
  };

  const handleLike = async (id: string) => {
    try {
      const response = await apiPost(`/products/like/${id}`, {});
      if (response.success) {
        setLiked((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please login to like products";
      toast.error(errorMessage);
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium">Loading amazing products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-20 text-gray-500">No products found.</div>;
  }

  return (
    <div className="min-h-screen py-1">
      <div className="max-w-[1400px] mx-auto px-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const isLiked = liked.includes(product.id);
            const imageUrl = product.image.startsWith("http") 
              ? product.image 
              : `${"https://lunavest-ecormerce.onrender.com"}${product.image}`;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative border border-gray-100 flex flex-col h-full"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                      Official Store
                    </span>
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter w-fit">
                      Express
                    </span>
                  </div>

                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    priority={false}
                  />
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-rose-50 hover:scale-110 transition-all duration-300 z-10"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-300 ${
                        isLiked
                          ? "fill-rose-500 text-rose-500"
                          : "text-gray-400 group-hover:text-rose-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors h-10">
                    {product.name}
                  </h3>

                  <div className="mt-auto">
                    {/* Price */}
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold text-gray-900 leading-none">
                        Rp {product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 line-through">
                          Rp {(product.price * 1.2).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1 rounded">
                          -20%
                        </span>
                      </div>
                    </div>

                    {/* Rating & Stock */}
                    <div className="flex items-center justify-between text-[11px] mb-4">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= 4 ? "text-orange-400 fill-orange-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <span className="text-gray-400">(45)</span>
                      </div>
                      <span className={`font-bold ${product.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
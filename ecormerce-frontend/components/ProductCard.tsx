"use client"
import React, { useState, useEffect } from "react";
import { Heart, Star, ShoppingCart, Loader2 } from "lucide-react";
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
      const response = await apiFetch("/products/seeAllproducts");
      if (response.success) {
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
      const response = await apiFetch("/products/liked");
      if (response.success) {
        setLiked(response.data.map((p: any) => p.id));
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
    } catch (error: any) {
      toast.error(error.message || "Please login to like products");
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
              : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${product.image}`;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative border border-gray-100"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(product.id);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-rose-50 hover:scale-110 transition-all duration-300 z-10"
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
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors h-12">
                    {product.name}
                  </h3>

                  {/* Rating & Stock */}
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium text-gray-800">
                        4.5
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-rose-600"}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        Rp{product.price.toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
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
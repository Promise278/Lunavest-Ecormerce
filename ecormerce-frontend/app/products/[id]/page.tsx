"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch, apiPost } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category: string;
  image: string;
  User?: { id: string; name: string } | null;
}

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://lunavest-ecormerce.onrender.com";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiFetch<{ success: boolean; data: Product }>(
          `/products/${productId}`
        );
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Could not load this product"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchLiked = async () => {
      if (typeof window === "undefined" || !localStorage.getItem("token")) return;
      try {
        const response = await apiFetch<{ success: boolean; data: Product[] }>(
          "/products/liked"
        );
        if (response.success) {
          setLiked(response.data.some((item) => item.id === productId));
        }
      } catch (error) {
        // Not logged in or request failed; the heart just stays unset.
      }
    };

    fetchProduct();
    fetchLiked();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let count = 0; count < quantity; count += 1) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(
      `${quantity} x ${product.name} added to cart`
    );
    setQuantity(1);
  };

  const handleToggleLike = async () => {
    try {
      const response = await apiPost<Record<string, never>, { success: boolean; liked: boolean; message: string }>(
        `/products/like/${productId}`,
        {}
      );
      if (response.success) {
        setLiked(response.liked);
        toast.success(response.message);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Please login to save products"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <Package className="w-16 h-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${IMAGE_BASE}${product.image}`;
  const inStock = product.stock > 0 && product.status !== "inactive";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square bg-gray-50">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {product.category || "Other"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  inStock
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-rose-700 bg-rose-50"
                }`}
              >
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {product.User && (
              <p className="text-sm text-gray-500 mt-2">
                Sold by <span className="font-semibold">{product.User.name}</span>
              </p>
            )}

            <p className="text-3xl font-black text-indigo-600 mt-6">
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-gray-600 leading-relaxed mt-6">{product.description}</p>

            <div className="mt-auto pt-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((value) => Math.min(product.stock || 1, value + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleLike}
                  className={`p-4 rounded-2xl border transition-all ${
                    liked
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              <Link
                href="/checkout"
                className="block text-center mt-3 py-3 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Go to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

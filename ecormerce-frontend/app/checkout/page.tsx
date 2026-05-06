"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { apiPost } from "@/lib/api";
import { toast } from "react-toastify";
import { ShoppingBag, Trash2, CreditCard, ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const response = await apiPost("/orders/checkout", {
        items: cart,
        totalAmount: totalPrice,
      });

      if (response.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Checkout failed. Please login.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
          <ShoppingBag className="w-10 h-10 text-indigo-600" />
          Your Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 mt-2 mb-8">{"Looks like you haven't added anything yet."}</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-6 shadow-sm border border-gray-100 group"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
                    <Image
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `https://lunavest-ecormerce.onrender.com${item.image}`
                      }
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="grow">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-indigo-600 font-semibold mt-1">
                      Rp{item.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>Rp{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="h-px bg-gray-100 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">
                      Rp{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all hover:shadow-xl active:scale-[0.98] disabled:bg-indigo-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Place Order
                        <ArrowRight className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-base hover:bg-gray-100 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                  Secure Checkout Powered by LunaVest Payment Gateway
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

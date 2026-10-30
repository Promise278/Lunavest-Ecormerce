"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import {
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

interface OrderProduct {
  id: string;
  name: string;
  image: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  Product?: OrderProduct | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  OrderItems: OrderItem[];
}

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://lunavest-ecormerce.onrender.com";

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  paid: {
    label: "Paid",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Ban,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await apiFetch<{ success: boolean; data: Order[] }>(
        "/orders/my-orders"
      );
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Please login to see your orders"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.error("Please login to see your orders");
      router.push("/pages/signin");
      return;
    }
    fetchOrders();
  }, [fetchOrders, router]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await apiFetch(`/orders/${id}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled successfully");
      await fetchOrders();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Could not cancel this order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
            My Orders
          </h1>
          <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-500 border border-gray-100">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
            <p className="text-gray-500 mt-2 mb-8">
              When you place an order it will show up here.
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status =
                STATUS_STYLES[order.status] || STATUS_STYLES.pending;
              const StatusIcon = status.icon;
              const canCancel =
                order.status === "pending" || order.status === "paid";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${status.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {order.OrderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 px-6 py-4"
                      >
                        <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                          {item.Product && (
                            <Image
                              src={
                                item.Product.image.startsWith("http")
                                  ? item.Product.image
                                  : `${IMAGE_BASE}${item.Product.image}`
                              }
                              alt={item.Product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="grow">
                          <p className="text-sm font-bold text-gray-900">
                            {item.Product ? item.Product.name : "Product removed"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₦{item.price.toLocaleString()} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-xl font-black text-indigo-600">
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    {canCancel ? (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancellingId === order.id}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === order.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Cancel order
                          </>
                        )}
                      </button>
                    ) : (
                      <p className="text-xs text-gray-400">
                        This order can no longer be cancelled.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

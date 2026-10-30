"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import {
  ArrowRight,
  Banknote,
  ClipboardList,
  Clock,
  Loader2,
  Package,
  PackagePlus,
  ShieldAlert,
} from "lucide-react";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  User?: { name: string; email: string } | null;
}

interface ProductsResponse {
  success: boolean;
  data: unknown[];
  pagination?: { total: number };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Please login first");
      router.push("/pages/signin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      toast.error("Access denied. Admins only.");
      router.push("/");
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    const loadDashboard = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          apiFetch<{ success: boolean; data: Order[] }>("/orders"),
          apiFetch<ProductsResponse>("/products/seeAllproducts?limit=1"),
        ]);

        if (ordersResponse.success) setOrders(ordersResponse.data);
        if (productsResponse.success) {
          setProductCount(
            productsResponse.pagination?.total ?? productsResponse.data.length
          );
        }
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Could not load the dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-pulse">
          <ShieldAlert className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const revenue = orders
    .filter((order) => ["paid", "shipped", "delivered"].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Products",
      value: productCount.toLocaleString(),
      icon: Package,
      className: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total orders",
      value: orders.length.toLocaleString(),
      icon: ClipboardList,
      className: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending orders",
      value: pendingCount.toLocaleString(),
      icon: Clock,
      className: "bg-amber-50 text-amber-600",
    },
    {
      label: "Revenue",
      value: `₦${revenue.toLocaleString()}`,
      icon: Banknote,
      className: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Everything you need to run the store, in one place.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-gray-500 font-medium">Loading your store...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${stat.className}`}>
                      <StatIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <Link
                href="/stock"
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                    <PackagePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Add a product</p>
                    <p className="text-sm text-gray-500">Stock a new item with an image</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                href="/admin/orders"
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Manage orders</p>
                    <p className="text-sm text-gray-500">Move orders through fulfilment</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Recent orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View all
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.User ? order.User.name : "Unknown customer"} ·{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            STATUS_CLASSES[order.status] || STATUS_CLASSES.pending
                          }`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          ₦{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

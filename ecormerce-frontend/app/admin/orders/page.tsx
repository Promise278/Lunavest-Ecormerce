"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import {
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  ShieldAlert,
  Truck,
} from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  Product?: { id: string; name: string } | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  User?: { id: string; name: string; email: string } | null;
  OrderItems: OrderItem[];
}

const FILTERS = ["all", "pending", "paid", "shipped", "delivered", "cancelled"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  paid: { label: "Paid", className: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  shipped: { label: "Shipped", className: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Truck },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", className: "bg-rose-50 text-rose-700 border-rose-200", icon: Ban },
};

const NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: "paid", label: "Mark as paid" },
  paid: { status: "shipped", label: "Mark as shipped" },
  shipped: { status: "delivered", label: "Mark as delivered" },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const response = await apiFetch<{ success: boolean; data: Order[] }>(
        `/orders${query}`
      );
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Could not load orders"
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isAuthorized) fetchOrders();
  }, [isAuthorized, fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Order marked as ${status}`);
      await fetchOrders();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <Package className="w-9 h-9 text-indigo-600" />
              Order Management
            </h1>
            <p className="text-gray-500 mt-1">Review every order and move it through fulfilment.</p>
          </div>
          <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-500 border border-gray-100">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border capitalize transition-all ${
                filter === option
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">No orders here</h2>
            <p className="text-gray-500 mt-2">
              {filter === "all"
                ? "Nothing has been ordered yet."
                : `There are no ${filter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
              const StatusIcon = status.icon;
              const nextStep = NEXT_STEP[order.status];
              const isUpdating = updatingId === order.id;

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

                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {order.User ? order.User.name : "Unknown customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.User ? order.User.email : ""}
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
                      <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-3">
                        <p className="text-sm text-gray-700">
                          {item.Product ? item.Product.name : "Product removed"}{" "}
                          <span className="text-gray-400">x {item.quantity}</span>
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Order total</p>
                      <p className="text-xl font-black text-indigo-600">
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {nextStep && (
                        <button
                          onClick={() => updateStatus(order.id, nextStep.status)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          {nextStep.label}
                        </button>
                      )}

                      {(order.status === "pending" || order.status === "paid") && (
                        <button
                          onClick={() => updateStatus(order.id, "cancelled")}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Ban className="w-4 h-4" />
                          Cancel order
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <span className="text-xs text-gray-400">Fulfilment complete</span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="text-xs text-gray-400">Stock was returned</span>
                      )}
                    </div>
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

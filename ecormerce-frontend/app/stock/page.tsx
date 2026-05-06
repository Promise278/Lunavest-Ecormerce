"use client";
import React, { useState, useEffect } from "react";
import { apiFormData } from "@/lib/api";
import { toast } from "react-toastify";
import { Upload, Package, DollarSign, List, FileText, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StockPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "available",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a product image");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("status", formData.status);
      data.append("image", image);

      await apiFormData("/products/generate_products", data);
      toast.success("Product added successfully!");
      
      // Reset form
      setFormData({ name: "", description: "", price: "", stock: "", status: "available" });
      setImage(null);
      setPreview(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gray-900 px-8 py-10 text-white text-center">
            <h1 className="text-3xl font-extrabold flex items-center justify-center gap-3">
              <Package className="w-8 h-8" />
              Stock New Product
            </h1>
            <p className="mt-2 text-gray-400">Add a new item to your store collection</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <List className="w-4 h-4 text-gray-500" />
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900"
                  placeholder="e.g. Classic Denim Jacket"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Price (Rp)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900"
                  placeholder="250000"
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  Initial Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900"
                  placeholder="50"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <List className="w-4 h-4 text-gray-500" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none appearance-none bg-white text-gray-900"
                >
                  <option value="available">Available</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none resize-none text-gray-900"
                placeholder="Describe your product..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-gray-500" />
                Product Image
              </label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:border-gray-400 transition-colors group bg-gray-50/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-4 text-center">
                  {preview ? (
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                        <Upload className="w-10 h-10 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-700">Click to upload image</p>
                        <p className="text-sm text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all hover:shadow-xl active:scale-[0.98] disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Publish Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

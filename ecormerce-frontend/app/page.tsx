import Cart from "@/components/Cart";
import HeroSection from "@/components/Hero";
import React from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  return (
    <div className="">
      <HeroSection />
      <Cart search={search} category={category} />
    </div>
  );
}

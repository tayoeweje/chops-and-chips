"use client";

import { useEffect, useState } from "react";
import { getFoodItems } from "@/firebase/firestore";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const items = await getFoodItems();
        setFoods(items);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const categories = ["All", ...Array.from(new Set(foods.map((f) => f.category)))];
  const filteredFoods = category === "All" ? foods : foods.filter((f) => f.category === category);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to <span className="text-brand-red">Chops & Chips</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Delicious meals prepared with love. Order now and enjoy!
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c
              ? "bg-brand-red text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => (
          <div key={food.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              {food.imageUrl ? (
                <Image src={food.imageUrl} alt={food.name} width={400} height={300} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{food.name}</h3>
                <span className="text-brand-red font-bold">${food.price}</span>
              </div>
              <p className="mt-1 text-gray-500 text-sm line-clamp-2">{food.description}</p>
              <div className="mt-4">
                <Link
                  href={`/food/${food.id}`}
                  className="block w-full text-center bg-brand-yellow text-brand-red font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No food items found.
        </div>
      )}
    </div>
  );
}

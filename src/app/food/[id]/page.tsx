"use client";

import { useEffect, useState } from "react";
import { getFoodItems } from "@/firebase/firestore";
import { useCart } from "@/lib/cartContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function FoodPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [food, setFood] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const items = await getFoodItems();
                const item = items.find((i) => i.id === id);
                setFood(item);
            } catch (error) {
                console.error("Failed to fetch food item:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchFood();
    }, [id]);

    const handleAddToCart = () => {
        if (food) {
            addToCart({
                id: food.id,
                name: food.name,
                price: food.price,
                quantity: quantity,
                imageUrl: food.imageUrl
            });
            router.push("/cart");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    if (!food) {
        return <div className="text-center mt-10">Food item not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-200">
                    {food.imageUrl ? (
                        <Image src={food.imageUrl} alt={food.name} width={600} height={400} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Image
                        </div>
                    )}
                </div>
                <div className="p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{food.name}</h1>
                        <p className="text-2xl text-brand-red font-bold mb-4">${food.price}</p>
                        <p className="text-gray-600 mb-6">{food.description}</p>
                        <div className="mb-4">
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{food.category}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 hover:bg-gray-100"
                                >-</button>
                                <span className="px-3 py-1 border-l border-r border-gray-300">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-1 hover:bg-gray-100"
                                >+</button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-brand-red text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors shadow-md"
                        >
                            Add to Cart - ${(food.price * quantity).toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

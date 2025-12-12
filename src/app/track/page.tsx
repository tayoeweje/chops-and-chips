"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getOrder } from "@/firebase/firestore";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initialOrderId = searchParams.get("orderId");
    const [orderId, setOrderId] = useState(initialOrderId || "");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialOrderId) {
            handleTrack(initialOrderId);
        }
    }, [initialOrderId]);

    const handleTrack = (id: string) => {
        setLoading(true);
        setError("");

        // Subscribe to order updates
        try {
            const unsubscribe = getOrder(id, (data) => {
                setLoading(false);
                if (data) {
                    setOrder(data);
                } else {
                    setError("Order not found");
                    setOrder(null);
                }
            });
            return unsubscribe;
        } catch (err) {
            console.error("Error tracking order:", err);
            setError("Failed to track order. Please check your connection.");
            setLoading(false);
            return () => { };
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId) {
            handleTrack(orderId);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "preparing": return "bg-blue-100 text-blue-800";
            case "ready": return "bg-green-100 text-green-800";
            case "completed": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ["pending", "preparing", "ready", "completed"];
        return steps.indexOf(status);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Track Your Order</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red focus:border-brand-red"
                    />
                    <button
                        type="submit"
                        className="bg-brand-red text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors"
                    >
                        Track
                    </button>
                </form>
            </div>

            {loading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {order && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-brand-yellow px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-brand-red">Order #{order.id}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Progress Bar */}
                        <div className="relative mb-8">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${(getStatusStep(order.status) + 1) * 25}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-red transition-all duration-500"
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span className={getStatusStep(order.status) >= 0 ? "text-brand-red font-bold" : ""}>Pending</span>
                                <span className={getStatusStep(order.status) >= 1 ? "text-brand-red font-bold" : ""}>Preparing</span>
                                <span className={getStatusStep(order.status) >= 2 ? "text-brand-red font-bold" : ""}>Ready</span>
                                <span className={getStatusStep(order.status) >= 3 ? "text-brand-red font-bold" : ""}>Completed</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                            <ul className="space-y-3 mb-6">
                                {order.items.map((item: any, index: number) => (
                                    <li key={index} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4">
                                <span>Total</span>
                                <span className="text-brand-red">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackOrderContent />
        </Suspense>
    );
}

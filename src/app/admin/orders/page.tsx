"use client";

import { useState, useEffect } from "react";
import { subscribeToOrders, updateOrderStatus } from "@/firebase/firestore";

export default function LiveOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToOrders((updatedOrders) => {
            setOrders(updatedOrders);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateOrderStatus(id, newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "preparing": return "bg-blue-100 text-blue-800 border-blue-200";
            case "ready": return "bg-green-100 text-green-800 border-green-200";
            case "completed": return "bg-gray-100 text-gray-800 border-gray-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Orders</h1>

            <div className="grid grid-cols-1 gap-6">
                {orders.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
                        No orders found.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                        </p>
                                        <div className="mt-2 text-sm">
                                            <p><span className="font-semibold">Customer:</span> {order.customer.name} ({order.customer.phone})</p>
                                            <p><span className="font-semibold">Address:</span> {order.customer.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {["pending", "preparing", "ready", "completed"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(order.id, status)}
                                                disabled={order.status === status}
                                                className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${order.status === status
                                                        ? "bg-gray-800 text-white cursor-default"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Items</h3>
                                    <ul className="space-y-2">
                                        {order.items.map((item: any, idx: number) => (
                                            <li key={idx} className="flex justify-between text-sm">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between font-bold text-base mt-4 pt-2 border-t border-gray-100">
                                        <span>Total</span>
                                        <span className="text-brand-red">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

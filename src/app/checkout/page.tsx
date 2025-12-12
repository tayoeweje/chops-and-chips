"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import { createOrder } from "@/firebase/firestore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                customer: formData,
                items: cart,
                total: cartTotal,
                status: "pending"
            };

            const docRef = await createOrder(orderData);
            clearCart();
            router.push(`/track?orderId=${docRef.id}`);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500">Redirecting to menu...</p>
                {/* Ideally redirect automatically or show link */}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                    <ul className="space-y-2">
                        {cart.map((item) => (
                            <li key={item.id} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-100">
                        <span>Total</span>
                        <span className="text-brand-red">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                        <textarea
                            name="address"
                            id="address"
                            rows={3}
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                </form>
            </div>
        </div>
    );
}

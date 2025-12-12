"use client";

import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const router = useRouter();

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any delicious food yet.</p>
                <Link
                    href="/"
                    className="bg-brand-red text-white font-bold py-3 px-6 rounded hover:bg-red-700 transition-colors"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                        <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover object-center"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">No Image</div>
                                )}
                            </div>

                            <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:justify-between w-full mt-4 sm:mt-0">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        <Link href={`/food/${item.id}`}>{item.name}</Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">${item.price}</p>
                                </div>

                                <div className="flex items-center mt-4 sm:mt-0 gap-4">
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                        >-</button>
                                        <span className="px-3 py-1 border-l border-r border-gray-300 w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-sm font-medium text-red-600 hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                        <p>Subtotal</p>
                        <p>${cartTotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 mb-6">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/checkout"
                            className="flex justify-center items-center w-full bg-brand-red text-white font-bold py-3 px-6 rounded hover:bg-red-700 transition-colors shadow-md"
                        >
                            Proceed to Checkout
                        </Link>
                        <button
                            onClick={clearCart}
                            className="text-center text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

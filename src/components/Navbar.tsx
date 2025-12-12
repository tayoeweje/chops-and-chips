"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <nav className="bg-brand-red text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="font-bold text-2xl tracking-wider">
                            Chops & Chips
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                                Menu
                            </Link>
                            <Link href="/track" className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                                Track Order
                            </Link>
                            <Link href="/cart" className="bg-brand-yellow text-brand-red hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-bold flex items-center gap-2">
                                <span>Cart</span>
                                {/* Cart count badge could go here */}
                                <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="bg-red-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-red-600 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                            Menu
                        </Link>
                        <Link href="/track" className="hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                            Track Order
                        </Link>
                        <Link href="/cart" className="bg-brand-yellow text-brand-red hover:bg-yellow-400 block px-3 py-2 rounded-md text-base font-bold">
                            Cart (0)
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

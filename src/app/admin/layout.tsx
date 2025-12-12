"use client";

import { useAuth, logoutAdmin } from "@/firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    if (!user && pathname !== "/admin/login") {
        return null; // Will redirect
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await logoutAdmin();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white hidden md:block flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-wider">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <Link href="/admin" className={`block px-6 py-3 hover:bg-gray-800 ${pathname === '/admin' ? 'bg-gray-800 border-l-4 border-brand-yellow' : ''}`}>
                        Dashboard
                    </Link>
                    <Link href="/admin/orders" className={`block px-6 py-3 hover:bg-gray-800 ${pathname === '/admin/orders' ? 'bg-gray-800 border-l-4 border-brand-yellow' : ''}`}>
                        Live Orders
                    </Link>
                    <Link href="/admin/menu" className={`block px-6 py-3 hover:bg-gray-800 ${pathname === '/admin/menu' ? 'bg-gray-800 border-l-4 border-brand-yellow' : ''}`}>
                        Menu Management
                    </Link>
                    <Link href="/admin/theme" className={`block px-6 py-3 hover:bg-gray-800 ${pathname === '/admin/theme' ? 'bg-gray-800 border-l-4 border-brand-yellow' : ''}`}>
                        Theme Settings
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-6">
                    <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden bg-white shadow-sm z-10 p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <button onClick={handleLogout} className="text-red-600 font-medium">Logout</button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

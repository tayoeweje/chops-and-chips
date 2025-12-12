"use client";

import { useState } from "react";
import { saveThemeSettings } from "@/firebase/firestore";

export default function ThemeManagementPage() {
    const [primaryColor, setPrimaryColor] = useState("#FFD54F");
    const [secondaryColor, setSecondaryColor] = useState("#D84315");
    const [font, setFont] = useState("sans");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveThemeSettings({
                primaryColor,
                secondaryColor,
                font
            });
            alert("Theme settings saved!");
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("Failed to save theme settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Theme Management</h1>

            <div className="bg-white rounded-lg shadow p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color (Yellow)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-10 w-20 p-1 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color (Red)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="h-10 w-20 p-1 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                        >
                            <option value="sans">Sans Serif (Inter/Geist)</option>
                            <option value="serif">Serif (Merriweather)</option>
                            <option value="mono">Monospace (Roboto Mono)</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-brand-red text-white font-bold py-2 px-8 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Theme Settings"}
                        </button>
                    </div>
                </form>

                <div className="mt-12 border-t border-gray-200 pt-8">
                    <h2 className="text-xl font-bold mb-4">Preview</h2>
                    <div className="p-6 border border-gray-200 rounded-lg" style={{ fontFamily: font === 'serif' ? 'serif' : font === 'mono' ? 'monospace' : 'sans-serif' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold" style={{ color: secondaryColor }}>Chops & Chips</h3>
                            <button className="px-4 py-2 rounded text-white font-bold" style={{ backgroundColor: secondaryColor }}>Order Now</button>
                        </div>
                        <div className="h-32 rounded-lg mb-4 flex items-center justify-center text-gray-800 font-bold" style={{ backgroundColor: primaryColor }}>
                            Hero Banner Area
                        </div>
                        <p className="text-gray-600">
                            This is how your content might look with the selected colors and fonts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { saveThemeSettings, getThemeSettings } from "@/firebase/firestore";

export default function ThemeManagementPage() {
    const [primaryColor, setPrimaryColor] = useState("#FFD54F");
    const [secondaryColor, setSecondaryColor] = useState("#D84315");
    const [font, setFont] = useState("sans");
    const [glassMode, setGlassMode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getThemeSettings();
            if (settings) {
                if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
                if (settings.secondaryColor) setSecondaryColor(settings.secondaryColor);
                if (settings.font) setFont(settings.font);
                if (settings.glassMode !== undefined) setGlassMode(settings.glassMode);
            }
        };
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveThemeSettings({
                primaryColor,
                secondaryColor,
                font,
                glassMode
            });
            // Force reload to apply theme immediately if ThemeProvider doesn't pick it up instantly (it should via window reload or context)
            // For now, simple alert.
            alert("Theme settings saved! Refresh the page to see changes.");
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("Failed to save theme settings.");
        } finally {
            setLoading(false);
        }
    };

    const getFontFamily = (f: string) => {
        switch (f) {
            case "cursive": return "'Dancing Script', cursive";
            case "scribble": return "'Permanent Marker', cursive";
            case "serif": return "'Merriweather', serif";
            case "mono": return "'Roboto Mono', monospace";
            default: return "'Inter', sans-serif";
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Theme Management</h1>

            <div className={`rounded-lg shadow p-8 ${glassMode ? 'bg-white/30 backdrop-blur-md border border-white/20' : 'bg-white'}`}>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                            <select
                                value={font}
                                onChange={(e) => setFont(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-red focus:border-brand-red"
                            >
                                <option value="sans">Modern Sans (Inter)</option>
                                <option value="serif">Classic Serif (Merriweather)</option>
                                <option value="mono">Tech Mono (Roboto Mono)</option>
                                <option value="cursive">Elegant Cursive (Dancing Script)</option>
                                <option value="scribble">Playful Scribble (Permanent Marker)</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={glassMode}
                                    onChange={(e) => setGlassMode(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-brand-red rounded focus:ring-brand-red"
                                />
                                <span className="text-gray-900 font-medium">Enable Liquid Glass Design (iOS 26 Style)</span>
                            </label>
                        </div>
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
                    <div
                        className={`p-6 border border-gray-200 rounded-lg transition-all duration-300 ${glassMode ? 'bg-white/20 backdrop-blur-lg shadow-xl border-white/30' : 'bg-white'}`}
                        style={{ fontFamily: getFontFamily(font) }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold" style={{ color: secondaryColor }}>Chops & Chips</h3>
                            <button className="px-4 py-2 rounded text-white font-bold shadow-md" style={{ backgroundColor: secondaryColor }}>Order Now</button>
                        </div>
                        <div className="h-32 rounded-lg mb-4 flex items-center justify-center text-gray-800 font-bold shadow-inner" style={{ backgroundColor: primaryColor }}>
                            Hero Banner Area
                        </div>
                        <p className="text-gray-600">
                            This is how your content might look with the selected colors, fonts, and design style.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


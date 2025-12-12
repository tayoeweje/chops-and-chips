"use client";

import { useEffect, useState } from "react";
import { subscribeToThemeSettings } from "@/firebase/firestore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = subscribeToThemeSettings((settings) => {
            if (settings) {
                setTheme(settings);
                applyTheme(settings);
            }
        });
        return () => unsubscribe();
    }, []);

    const applyTheme = (settings: any) => {
        const root = document.documentElement;
        if (settings.primaryColor) root.style.setProperty("--primary-color", settings.primaryColor);
        if (settings.secondaryColor) root.style.setProperty("--secondary-color", settings.secondaryColor);

        if (settings.font) {
            let fontStack = "sans-serif";
            switch (settings.font) {
                case "cursive": fontStack = "'Dancing Script', cursive"; break;
                case "scribble": fontStack = "'Permanent Marker', cursive"; break;
                case "serif": fontStack = "'Merriweather', serif"; break;
                case "mono": fontStack = "'Roboto Mono', monospace"; break;
                default: fontStack = "'Inter', sans-serif";
            }
            root.style.setProperty("--font-family", fontStack);
        }

        if (settings.glassMode) {
            document.body.classList.add("glass-mode");
        } else {
            document.body.classList.remove("glass-mode");
        }

        // Apply card style globally via a class on body or root, 
        // but since we want to target specific elements, we can use a CSS variable or a data attribute.
        // Let's use a data attribute on the body for simplicity in CSS selectors if needed, 
        // OR just rely on the fact that we need to pass this to components.
        // Actually, simpler approach: Add a class to body representing the card style, 
        // and have CSS selectors like body.style-minimal .card-base { ... }
        // Let's update globals.css to use this approach for cleaner component code.

        document.body.classList.remove("style-minimal", "style-bordered", "style-shadow", "style-glass");
        if (settings.cardStyle) {
            document.body.classList.add(`style-${settings.cardStyle}`);
        } else {
            document.body.classList.add("style-shadow"); // Default
        }
    };

    return <>{children}</>;
}

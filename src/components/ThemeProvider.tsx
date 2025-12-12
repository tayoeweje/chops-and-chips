"use client";

import { useEffect, useState } from "react";
import { getThemeSettings } from "@/firebase/firestore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<any>(null);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const settings = await getThemeSettings();
                if (settings) {
                    setTheme(settings);
                    applyTheme(settings);
                }
            } catch (error) {
                console.error("Failed to load theme:", error);
            }
        };
        fetchTheme();
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
    };

    return <>{children}</>;
}

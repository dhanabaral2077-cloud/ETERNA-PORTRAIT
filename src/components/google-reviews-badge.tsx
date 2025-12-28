"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        merchantwidget?: {
            start: (config: {
                merchant_id: number;
                position?: string;
                region?: string;
            }) => void;
        };
    }
}

export function GoogleReviewsBadge() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            let attempts = 0;
            const initBadge = () => {
                if (typeof window !== 'undefined' && window.merchantwidget) {
                    console.log("Initializing Google Reviews Badge...");
                    try {
                        window.merchantwidget.start({
                            merchant_id: 5699327185,
                            position: "BOTTOM_LEFT",
                        });
                    } catch (e) {
                        console.error("Google Badge Error:", e);
                    }
                } else if (attempts < 10) {
                    console.log("Waiting for merchantwidget...", attempts);
                    attempts++;
                    setTimeout(initBadge, 500);
                } else {
                    console.error("Failed to load Google Reviews Badge: merchantwidget not found.");
                }
            };

            // Short delay to ensure execution context
            setTimeout(initBadge, 100);
        }
    }, [isLoaded]);

    return (
        <Script
            id="merchantWidgetScript"
            src="https://www.gstatic.com/shopping/merchant/merchantwidget.js"
            strategy="afterInteractive"
            onLoad={() => setIsLoaded(true)}
        />
    );
}

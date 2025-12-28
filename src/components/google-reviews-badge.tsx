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
        if (isLoaded && window.merchantwidget) {
            window.merchantwidget.start({
                merchant_id: 5699327185,
                position: "BOTTOM_LEFT",
            });
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

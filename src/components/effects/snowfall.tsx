"use client";

import { useEffect, useRef, useState } from "react";

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
}

export function Snowfall() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let snowflakes: Snowflake[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const createSnowflakes = (count: number) => {
            const flakes: Snowflake[] = [];
            for (let i = 0; i < count; i++) {
                flakes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1, // 1px to 3px
                    speed: Math.random() * 1 + 0.5, // 0.5 to 1.5
                    wind: Math.random() * 0.5 - 0.25,
                    opacity: Math.random() * 0.5 + 0.3,
                });
            }
            return flakes;
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            snowflakes = createSnowflakes(50); // Adjust count for density
        };

        const update = () => {
            ctx.clearRect(0, 0, width, height);

            snowflakes.forEach((flake) => {
                // Update position
                flake.y += flake.speed;
                flake.x += flake.wind;

                // Reset if out of bounds
                if (flake.y > height) {
                    flake.y = 0;
                    flake.x = Math.random() * width;
                }
                if (flake.x > width) {
                    flake.x = 0;
                } else if (flake.x < 0) {
                    flake.x = width;
                }

                // Draw
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.fill();
                ctx.closePath();
            });

            animationFrameId = requestAnimationFrame(update);
        };

        // Initialize
        resize();
        window.addEventListener("resize", resize);
        update();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ pointerEvents: 'none' }}
        />
    );
}

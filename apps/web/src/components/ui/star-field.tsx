"use client";

import React, { useRef, useEffect } from "react";

interface Star {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

export function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        const numStars = 150;
        const connectionDistance = 100;
        const mouse = { x: -1000, y: -1000 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2, // Slower, more elegant movement
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 1.5,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear but transparent

            // Update and draw stars
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                // Move
                star.x += star.vx;
                star.y += star.vy;

                // Bounce horizontally
                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                // Bounce vertically
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                // Mouse repulsion
                const dx = mouse.x - star.x;
                const dy = mouse.y - star.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const angle = Math.atan2(dy, dx);
                    const force = (200 - dist) / 200;
                    star.x -= Math.cos(angle) * force * 2;
                    star.y -= Math.sin(angle) * force * 2;
                }

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                ctx.fill();

                // Connect
                for (let j = i + 1; j < stars.length; j++) {
                    const star2 = stars[j];
                    const dx = star.x - star2.x;
                    const dy = star.y - star2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * (1 - dist / connectionDistance)})`; // Cyber Blue tint
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(star2.x, star2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-background"
        />
    );
}

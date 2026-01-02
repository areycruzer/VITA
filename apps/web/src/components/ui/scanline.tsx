"use client";

import { cn } from "@/lib/utils";

export const Scanline = ({ className }: { className?: string }) => {
    return (
        <div className={cn("absolute inset-0 pointer-events-none overflow-hidden rounded-xl", className)}>
            <div className="scanline" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
    );
};

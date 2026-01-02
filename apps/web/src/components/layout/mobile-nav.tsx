"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Zap, Menu } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 inset-x-4 h-16 rounded-full glass-liquid border border-white/10 flex items-center justify-around z-50 lg:hidden px-4 shadow-2xl backdrop-blur-[20px] bg-black/40">
            <Link
                href="/dashboard"
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                    pathname === "/dashboard" ? "bg-primary/20 text-primary scale-110" : "text-muted-foreground hover:text-white"
                )}
            >
                <LayoutDashboard className="h-5 w-5" />
            </Link>

            <Link
                href="/pledge"
                className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full -mt-8 border-4 border-[#020202] bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95",
                    pathname === "/pledge" && "ring-2 ring-primary ring-offset-2 ring-offset-[#020202]"
                )}
            >
                <Zap className="h-6 w-6" />
            </Link>

            <button
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-muted-foreground hover:text-white transition-colors"
                onClick={() => alert("Menu coming soon")}
            >
                <Menu className="h-5 w-5" />
            </button>
        </div>
    );
}

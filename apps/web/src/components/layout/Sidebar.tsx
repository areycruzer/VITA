"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Zap,
    Layers,
    Scale,
    Settings,
    BookOpen
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pledge Vitality", href: "/pledge", icon: Zap },
    { name: "My Echoes", href: "/echoes", icon: Layers, disabled: true },
    { name: "Governance", href: "/governance", icon: Scale, disabled: true },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r border-border bg-card/50 lg:block lg:w-72 lg:fixed lg:inset-y-0 lg:top-16 lg:bottom-0 overflow-y-auto">
            <div className="flex flex-col gap-2 p-6">
                <div className="mb-4 px-2">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protocol</h2>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.disabled ? "#" : item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    item.disabled && "opacity-50 cursor-not-allowed",
                                    isActive
                                        ? "bg-primary/10 text-primary glow-cyan border border-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {item.name}
                                {item.disabled && (
                                    <span className="ml-auto text-[10px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded">SOON</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 mb-4 px-2">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</h2>
                </div>
                <nav className="space-y-1">
                    <Link href="https://docs.mantle.xyz" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        <BookOpen className="h-4 w-4" />
                        Documentation
                    </Link>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground opacity-50 cursor-not-allowed">
                        <Settings className="h-4 w-4" />
                        Settings
                    </button>
                </nav>
            </div>
        </div>
    );
}

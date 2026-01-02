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
    { name: "My Echoes", href: "/dashboard/echoes", icon: Layers },
    { name: "Governance", href: "/dashboard/governance", icon: Scale },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r border-border glass-liquid lg:block lg:w-72 lg:fixed lg:inset-y-0 lg:top-16 lg:bottom-0 overflow-y-auto">
            <div className="flex flex-col gap-2 p-6">
                <div className="mb-4 px-2">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protocol</h2>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 mb-4 px-2">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</h2>
                </div>
                <nav className="space-y-1">
                    <Link href="/dashboard/docs" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
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

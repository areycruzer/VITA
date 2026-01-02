import Link from "next/link";
import { ConnectButton } from "../ConnectButton";
import { Logo } from "../Logo";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-6">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo className="h-9 w-9" />
                    <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">VITA</span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Docs Link (Desktop) */}
                    <Link
                        href="https://docs.mantle.xyz"
                        target="_blank"
                        className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Documentation
                    </Link>

                    <ConnectButton />
                </div>
            </div>
        </header>
    );
}

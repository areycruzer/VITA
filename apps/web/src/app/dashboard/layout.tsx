import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 lg:pl-72 p-8 pt-6">
                    {children}
                    <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
                        <div className="flex items-center justify-center gap-4">
                            <span>VITA Protocol v1.0.0</span>
                            <span>•</span>
                            <a href="#" className="hover:text-foreground transition-colors">Audit Report</a>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                Built on Mantle
                            </span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

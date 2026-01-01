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
                </main>
            </div>
        </div>
    );
}

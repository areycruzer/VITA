
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative w-10 h-10 group cursor-pointer perspective-1000", className)}>
            {/* Outer Glow - Animated pulse */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full opacity-20 blur-xl group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />

            {/* Main Glass Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 ease-out">

                {/* Inner Geometric Shape - The "V" */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    <path
                        d="M4 4L12 20L20 4"
                        stroke="url(#logo-gradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-[4] transition-all duration-300"
                    />
                    <defs>
                        <linearGradient id="logo-gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#22d3ee" />   {/* Cyan-400 */}
                            <stop offset="50%" stopColor="#ffffff" />  {/* White center */}
                            <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet-500 */}
                        </linearGradient>
                    </defs>
                </svg>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            </div>
        </div>
    );
};

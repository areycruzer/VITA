import Link from "next/link";
import { ConnectButton } from "../components/ConnectButton";
import { Logo } from "../components/Logo";
import { ArrowUpRight, Github, Sparkles, Activity, Shield, Layers, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-white overflow-x-hidden">
      {/* Header */}
      <header className="relative z-40 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight">VITA</span>
              </Link>
              <div className="hidden md:flex items-center gap-8">
                <Link href="/dashboard" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/pledge" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Mint</Link>
                <Link href="/docs" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Docs</Link>
                <Link href="/governance" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Governance</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ConnectButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium text-white/70">Tokenize Your Productivity</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                Valorizing
                <span className="relative mx-3">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">Human Capital</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-violet-400/20 blur-2xl" />
                </span>
                Into
                <br />
                <span className="text-white/40">Liquid Assets</span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
                Mint your future work hours as yield-bearing tokens.
                Trade your human capital like any other asset on the blockchain.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/pledge">
                  <button className="group flex items-center gap-3 px-7 py-4 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all">
                    Start Minting
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </Link>
                <Link href="https://github.com/areycruzer/VITA" target="_blank">
                  <button className="flex items-center gap-3 px-7 py-4 rounded-xl border border-white/10 text-white/70 font-semibold hover:bg-white/[0.03] hover:text-white transition-all">
                    <Github className="w-5 h-5" />
                    View Source
                  </button>
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/[0.06]">
                <div>
                  <div className="text-2xl font-bold font-mono">$842K</div>
                  <div className="text-xs text-white/40 mt-1">TVL</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">392</div>
                  <div className="text-xs text-white/40 mt-1">Workers</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold font-mono text-violet-400">8.2%</div>
                  <div className="text-xs text-white/40 mt-1">Avg APY</div>
                </div>
              </div>
            </div>

            {/* Right: Mantle Synergy Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 rounded-3xl" />
              <div className="relative p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-mono text-white/60">Mantle Ecosystem Synergy</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
                    LIVE
                  </div>
                </div>

                {/* Synergy Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">mETH Yield Strategy</div>
                    <div className="text-lg font-mono text-cyan-400">~3.42% APY</div>
                    <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-cyan-500/50" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">Total Value Locked</div>
                    <div className="text-lg font-mono text-violet-400">$4.2M</div>
                    <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-violet-500/50" />
                    </div>
                  </div>

                  <div className="col-span-2 p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/40 mb-1">Recent Mint</div>
                      <div className="flex items-center gap-2">
                        <Github className="w-3 h-3 text-white/60" />
                        <span className="text-sm font-mono">areycruzer/VITA</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-emerald-400 font-medium">+2,400 VITA</div>
                      <div className="text-[10px] text-white/30">Just now</div>
                    </div>
                  </div>
                </div>

                {/* Trust Score Badge Floating */}
                <div className="absolute -right-4 top-20 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                      <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center border border-white/20">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Trust Score</div>
                      <div className="text-xs font-mono text-cyan-300">98/100 (Top 1%)</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-16 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center border border-white/20">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">ZK Compliance</div>
                      <div className="text-xs font-mono text-violet-300">Verified</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-32 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-3">How it works</h2>
              <p className="text-white/50 max-w-lg">Three steps to unlock the value of your future productivity</p>
            </div>
            <Link href="/pledge" className="hidden md:flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Start now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="absolute top-6 right-6 text-5xl font-bold text-white/[0.03] group-hover:text-cyan-400/10 transition-colors">01</div>
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-6">
                <Github className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect GitHub</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Link your developer profile. Our AI analyzes your commits, repos, and contributions to calculate your Vitality Score.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="absolute top-6 right-6 text-5xl font-bold text-white/[0.03] group-hover:text-violet-400/10 transition-colors">02</div>
              <div className="w-12 h-12 rounded-xl bg-violet-400/10 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pledge Hours</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Select your skill and pledge future work hours. The protocol calculates token value based on market rates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="absolute top-6 right-6 text-5xl font-bold text-white/[0.03] group-hover:text-emerald-400/10 transition-colors">03</div>
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mint & Earn</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Receive $VITA tokens backed by your pledged productivity. Hold for yield or trade on the open market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-500/20 to-transparent blur-[100px] pointer-events-none" />

            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to tokenize your skills?</h2>
              <p className="text-white/50 text-lg mb-8">
                Join developers who are already transforming their human capital into tradeable on-chain assets.
              </p>
              <Link href="/pledge">
                <button className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:opacity-90 transition-all">
                  Launch App
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="font-semibold">VITA Protocol</span>
              <span className="text-white/30 text-sm ml-4">Built on Mantle</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="#" className="hover:text-white transition-colors">Docs</Link>
              <Link href="https://github.com/areycruzer/VITA" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

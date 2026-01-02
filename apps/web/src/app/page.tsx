import Link from "next/link";
import { ConnectButton } from "../components/ConnectButton";
import { ArrowRight, Link as LinkIcon, Coins, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative border-b border-border/50">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-6 pt-8 pb-32">
          {/* Header */}
          <nav className="flex items-center justify-between mb-24">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-xl font-extrabold text-white tracking-tighter">V</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">VITA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/pledge" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Mint Access
              </Link>
              <Link href="https://docs.mantle.xyz" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </Link>
            </div>
            <ConnectButton />
          </nav>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Live on Mantle Sepolia
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tight leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Human Capital</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Stock Exchange</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Tokenize your future productivity as yield-bearing <span className="text-foreground font-medium">Real World Assets</span>.
              Trade skills, earn mETH yield, and unlock liquidity on chain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <button className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2">
                  Launch App <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="https://docs.mantle.xyz" target="_blank">
                <button className="px-8 py-4 rounded-xl border border-input bg-background/50 backdrop-blur-sm text-foreground font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-all">
                  Read Whitepaper
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Ticker (Simulated) */}
      <div className="border-y border-border/50 glass-matte">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-foreground">$12.4M</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">TVL</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-primary">1,240</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Workers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-purple-500">42,000h</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Hours Tokenized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-green-500">18.2%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Avg Yield</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-32 relative">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Protocol Mechanics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Built on ERC-3643 identity standards and Groth16 ZK proofs for privacy-preserving verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-2xl glass-matte hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LinkIcon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Connect & Verify</h3>
            <p className="text-muted-foreground leading-relaxed">
              Link GitHub/Upwork. Chainlink Functions verify contributions while ZK proofs keep your identity private.
            </p>
          </div>

          <div className="group p-8 rounded-2xl glass-matte hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Tokenize Hours</h3>
            <p className="text-muted-foreground leading-relaxed">
              Mint $VITA tokens using our valuation formula `V = (H×R)×S×e⁻λt`. Fully compliant ERC-3643 assets.
            </p>
          </div>

          <div className="group p-8 rounded-2xl glass-matte hover:border-green-500/50 transition-all hover:shadow-2xl hover:shadow-green-500/10">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Yield & Trade</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tokens generate native yield via mETH staking. Trade on the internal DEX or OTC with verified institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border glass-matte">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">V</span>
              </div>
              <span className="font-bold">VITA Protocol</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground/50">
            © 2026 VITA Protocol. Built on Mantle.
          </div>
        </div>
      </footer>
    </main>
  );
}

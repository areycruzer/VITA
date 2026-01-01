import Link from "next/link";
import { ConnectButton } from "../components/ConnectButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-mantle-dark via-background to-mantle-dark opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mantle-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mantle-purple/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-24">
          {/* Header */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mantle-cyan to-mantle-purple flex items-center justify-center">
                <span className="text-xl font-bold text-white">V</span>
              </div>
              <span className="text-2xl font-bold gradient-text">VITA</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/pledge"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Mint
              </Link>
              <ConnectButton />
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mantle-cyan/30 bg-mantle-cyan/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-mantle-cyan animate-pulse" />
              <span className="text-sm text-mantle-cyan">
                Built on Mantle Network
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">The Human Capital</span>
              <br />
              <span className="text-foreground">Stock Exchange</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Tokenize your future productivity as compliant, yield-bearing
              Real World Assets. Turn your skills into tradeable securities on
              the blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity glow-cyan">
                  Start Tokenizing
                </button>
              </Link>
              <Link href="https://docs.mantle.xyz" target="_blank">
                <button className="px-8 py-4 rounded-lg border border-border text-foreground font-semibold text-lg hover:bg-card transition-colors">
                  View Documentation
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
              <div className="text-4xl font-bold text-mantle-cyan mb-2">
                $0.00
              </div>
              <div className="text-muted-foreground">Total Value Locked</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
              <div className="text-4xl font-bold text-mantle-purple mb-2">0</div>
              <div className="text-muted-foreground">Workers Tokenized</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
              <div className="text-4xl font-bold text-foreground mb-2">20%</div>
              <div className="text-muted-foreground">Yield-Back to Workers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          How <span className="gradient-text">VITA</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-mantle-cyan/20 flex items-center justify-center mb-6">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Connect & Verify</h3>
            <p className="text-muted-foreground">
              Link your GitHub or Upwork profile. Our Chainlink oracles verify
              your productivity metrics and calculate your AI Reliability Score.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-mantle-purple/20 flex items-center justify-center mb-6">
              <span className="text-2xl">🪙</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Tokenize Hours</h3>
            <p className="text-muted-foreground">
              Mint ERC-3643 compliant tokens representing your pledged future
              work hours. Value is calculated using our V = (H×R)×S×e⁻λt formula.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-6">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Earn & Trade</h3>
            <p className="text-muted-foreground">
              Your tokens generate yield through mETH staking. Trade on
              compliant markets and receive 20% of all yield generated.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>
            Built with ❤️ for the Mantle Hackathon 2026 |{" "}
            <span className="text-foreground">Real Assets, Real Yield, Real Builders</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

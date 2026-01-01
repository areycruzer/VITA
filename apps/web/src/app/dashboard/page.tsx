"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Activity,
  TrendingUp,
  GitCommit,
  Clock,
  DollarSign,
  Zap,
  ArrowUpRight,
  Wallet,
  Github,
} from "lucide-react";
import Link from "next/link";
import { 
  useVitaBalance, 
  useWorkerProfile, 
  usePendingYield, 
  useStakingDetails,
  useClaimYield 
} from "@/lib/hooks";
import { CONTRACTS, EXPLORER_URL, SKILL_LABELS } from "@/lib/contracts";

// Mock data for the Productivity Echo chart
const generateProductivityData = () => {
  const data = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const baseValue = 75 + Math.sin(i * 0.3) * 15;
    const noise = (Math.random() - 0.5) * 10;
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timestamp: date.getTime(),
      vitalityScore: Math.max(0, Math.min(100, baseValue + noise)),
      commits: Math.floor(Math.random() * 15) + 1,
      hoursLogged: Math.floor(Math.random() * 8) + 2,
      earnings: Math.floor((baseValue + noise) * 10),
    });
  }
  return data;
};

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-xl">
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-mantle-cyan font-semibold">
              Vitality Score:{" "}
            </span>
            <span className="text-foreground">
              {payload[0]?.value?.toFixed(1)}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-mantle-purple font-semibold">Commits: </span>
            <span className="text-foreground">{payload[0]?.payload?.commits}</span>
          </p>
          <p className="text-sm">
            <span className="text-green-400 font-semibold">Earnings: </span>
            <span className="text-foreground">
              ${payload[0]?.payload?.earnings}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Stat card component
const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  positive = true,
}: {
  icon: any;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) => (
  <div className="bg-card border border-border rounded-xl p-6 hover:border-mantle-cyan/50 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-mantle-cyan/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-mantle-cyan" />
      </div>
      {change && (
        <span
          className={`text-sm font-medium ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {positive ? "+" : ""}
          {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

// Recent activity item
const ActivityItem = ({
  type,
  description,
  time,
  amount,
}: {
  type: "commit" | "mint" | "yield" | "verification";
  description: string;
  time: string;
  amount?: string;
}) => {
  const icons = {
    commit: GitCommit,
    mint: Zap,
    yield: DollarSign,
    verification: Activity,
  };
  const colors = {
    commit: "text-mantle-purple",
    mint: "text-mantle-cyan",
    yield: "text-green-400",
    verification: "text-yellow-400",
  };
  const Icon = icons[type];

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-card/50 transition-colors">
      <div
        className={`w-10 h-10 rounded-full bg-card flex items-center justify-center ${colors[type]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      {amount && (
        <span className="text-sm font-medium text-green-400">{amount}</span>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [productivityData, setProductivityData] = useState<any[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Contract data hooks
  const { balance, isLoading: balanceLoading } = useVitaBalance();
  const { totalMinted, vitalityScore, skillCategory, lastMintTimestamp } = useWorkerProfile();
  const { pendingYield } = usePendingYield();
  const { currentEthValue, yieldAccrued } = useStakingDetails();
  const { claim: claimYield, isPending: claimPending, isSuccess: claimSuccess } = useClaimYield();

  useEffect(() => {
    const data = generateProductivityData();
    setProductivityData(data);
    setCurrentScore(data[data.length - 1]?.vitalityScore || 0);
  }, []);

  // Calculate statistics
  const averageScore =
    productivityData.length > 0
      ? productivityData.reduce((acc, d) => acc + d.vitalityScore, 0) /
        productivityData.length
      : 0;
  const totalCommits = productivityData.reduce((acc, d) => acc + d.commits, 0);
  const totalEarnings = productivityData.reduce((acc, d) => acc + d.earnings, 0);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mantle-cyan to-mantle-purple flex items-center justify-center">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <span className="text-2xl font-bold gradient-text">VITA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pledge"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pledge
            </Link>
            <button
              onClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isConnected
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <Wallet className="w-4 h-4" />
              {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Vitality Dashboard
            </h1>
            <p className="text-muted-foreground">
              {isConnected ? `Balance: ${parseFloat(balance).toFixed(2)} VITA` : "Connect wallet to see your stats"}
            </p>
          </div>
          <Link
            href="/pledge"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-mantle-cyan to-mantle-purple text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Pledge Productivity
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Activity}
            label="Current Vitality Score"
            value={currentScore.toFixed(1)}
            change="12.5%"
            positive={true}
          />
          <StatCard
            icon={TrendingUp}
            label="30-Day Average"
            value={averageScore.toFixed(1)}
            change="8.2%"
            positive={true}
          />
          <StatCard
            icon={GitCommit}
            label="Total Commits"
            value={totalCommits.toString()}
            change="23"
            positive={true}
          />
          <StatCard
            icon={DollarSign}
            label="Total Earnings"
            value={`$${totalEarnings.toLocaleString()}`}
            change="$340"
            positive={true}
          />
        </div>

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Productivity Echo Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Productivity Echo
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your vitality score over the last 30 days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm rounded-lg bg-mantle-cyan/20 text-mantle-cyan">
                  30D
                </button>
                <button className="px-3 py-1 text-sm rounded-lg text-muted-foreground hover:bg-card">
                  90D
                </button>
                <button className="px-3 py-1 text-sm rounded-lg text-muted-foreground hover:bg-card">
                  1Y
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient
                      id="vitalityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fill: "#666", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#666"
                    tick={{ fill: "#666", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="vitalityScore"
                    stroke="#00D9FF"
                    strokeWidth={3}
                    fill="url(#vitalityGradient)"
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#00D9FF",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Token Info Panel */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Your $VITA Tokens
            </h2>

            <div className="space-y-6">
              {/* Token Balance */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-mantle-cyan/10 to-mantle-purple/10 border border-mantle-cyan/30">
                <p className="text-sm text-muted-foreground mb-1">
                  Token Balance
                </p>
                <p className="text-3xl font-bold gradient-text">1,250.00</p>
                <p className="text-sm text-muted-foreground">≈ $2,500.00 USD</p>
              </div>

              {/* Staking Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Staked in mETH
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    0.5 ETH
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Pending Yield
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    +$24.50
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    APY (mETH)
                  </span>
                  <span className="text-sm font-medium text-mantle-cyan">
                    1.36%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 rounded-lg bg-mantle-cyan text-background font-semibold hover:opacity-90 transition-opacity">
                  Claim Yield
                </button>
                <button className="w-full py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-card transition-colors">
                  View on Mantlescan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Recent Activity
              </h2>
              <button className="text-sm text-mantle-cyan hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <ActivityItem
                type="commit"
                description="Pushed 5 commits to vita-protocol/contracts"
                time="2 hours ago"
              />
              <ActivityItem
                type="yield"
                description="Received mETH staking yield"
                time="6 hours ago"
                amount="+$12.50"
              />
              <ActivityItem
                type="mint"
                description="Minted 100 $VITA tokens"
                time="1 day ago"
                amount="+100 VITA"
              />
              <ActivityItem
                type="verification"
                description="ZK Proof of Work verified"
                time="1 day ago"
              />
              <ActivityItem
                type="commit"
                description="Pushed 3 commits to personal/project"
                time="2 days ago"
              />
            </div>
          </div>

          {/* VITA Formula Breakdown */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Valuation Breakdown
            </h2>

            <div className="space-y-6">
              {/* Formula Display */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  VITA Formula
                </p>
                <p className="text-lg font-mono text-mantle-cyan">
                  V = (H × R) × S<sub>AI</sub> × e<sup>-λt</sup>
                </p>
              </div>

              {/* Current Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      H (Pledged Hours)
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Hours committed
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    40
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      R (Hourly Rate)
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Skill-based rate
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    $150
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      S<sub>AI</sub> (Vitality Score)
                    </span>
                    <p className="text-xs text-muted-foreground">
                      AI-computed score
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-mantle-cyan">
                    {currentScore.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      λ (Decay Factor)
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Time decay rate
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    0.001
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    Token Value
                  </span>
                  <span className="text-2xl font-bold gradient-text">
                    ${(40 * 150 * (currentScore / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

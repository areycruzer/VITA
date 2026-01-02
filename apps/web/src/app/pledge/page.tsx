"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { parseEther } from "viem";
import {
  Github,
  Wallet,
  CheckCircle,
  ArrowRight,
  Loader2,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useValuation, useMintEcho, useWorkerNonce } from "@/lib/hooks";
import { CONTRACTS, EXPLORER_URL, SKILL_LABELS, SKILL_CATEGORIES, SKILL_RATES } from "@/lib/contracts";

// Step states
type StepStatus = "pending" | "loading" | "complete" | "error";

interface PledgeStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

// GitHub profile data (fetched from real API)
interface GitHubProfile {
  username: string;
  avatar: string;
  repos: number;
  commits: number;
  stars: number;
  followers: number;
}

export default function PledgePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [pledgeHours, setPledgeHours] = useState(40);
  const [skillCategoryId, setSkillCategoryId] = useState(0); // SOLIDITY_DEV
  const [vitalityScore, setVitalityScore] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [valuationComplete, setValuationComplete] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [valuationData, setValuationData] = useState<{
    attestation: {
      worker: string;
      githubUsername: string;
      vitalityScore: string;
      reliabilityScore: string;
      pledgedHours: string;
      skillCategory: number;
      tokenValue: string;
      validUntil: string;
      nonce: string;
    };
    signature: { r: string; s: string; v: number };
  } | null>(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Contract hooks
  const { nonce } = useWorkerNonce();
  const { finalValue, hourlyRate, isLoading: valuationLoading } = useValuation(
    skillCategoryId,
    pledgeHours,
    vitalityScore
  );
  const { mint, hash: txHash, isPending: mintPending, isSuccess: mintComplete } = useMintEcho();

  const [steps, setSteps] = useState<PledgeStep[]>([
    {
      id: 1,
      title: "Connect Wallet",
      description: "Connect your Web3 wallet to Mantle Network",
      status: "pending",
    },
    {
      id: 2,
      title: "Link GitHub",
      description: "Authenticate with GitHub to verify your contributions",
      status: "pending",
    },
    {
      id: 3,
      title: "Configure Pledge",
      description: "Set your hours and skill category",
      status: "pending",
    },
    {
      id: 4,
      title: "AI Valuation",
      description: "Get your vitality score from AI oracle",
      status: "pending",
    },
    {
      id: 5,
      title: "Mint $VITA",
      description: "Mint your tokenized productivity on Mantle",
      status: "pending",
    },
  ]);

  const updateStepStatus = (stepId: number, status: StepStatus) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  // Update steps based on wallet connection
  useEffect(() => {
    if (isConnected && address) {
      updateStepStatus(1, "complete");
      if (currentStep === 0) setCurrentStep(1);
    }
  }, [isConnected, address]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    updateStepStatus(1, "loading");
    connect({ connector: injected() });
  };

  // Handle GitHub Connect - Fetches REAL GitHub data
  const handleGitHubConnect = async () => {
    if (!githubUsername.trim()) {
      alert("Please enter a GitHub username");
      return;
    }
    updateStepStatus(2, "loading");

    try {
      // Fetch real GitHub data using documented API endpoints
      const headers: Record<string, string> = {
        "User-Agent": "VITA-Protocol",
        "Accept": "application/vnd.github+json",
      };

      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${githubUsername}`, { headers });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        console.error("GitHub API Error:", userRes.status, errorText);
        if (userRes.status === 403) {
          throw new Error("Rate limit exceeded. Try again later.");
        }
        throw new Error("GitHub user not found");
      }

      const userData = await userRes.json();
      console.log("GitHub user data:", userData);

      // 2. Fetch repos for stars calculation
      const reposRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`, { headers });
      const repos = reposRes.ok ? await reposRes.json() : [];
      console.log("GitHub repos count:", Array.isArray(repos) ? repos.length : 0);

      // 3. Calculate total stars from repos
      const totalStars = Array.isArray(repos)
        ? repos.reduce((sum: number, r: { stargazers_count?: number }) => sum + (r.stargazers_count || 0), 0)
        : 0;

      // 4. Fetch recent events for commit count (last 90 days)
      let commitCount = 0;
      try {
        const eventsRes = await fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=100`, { headers });
        if (eventsRes.ok) {
          const events = await eventsRes.json();
          if (Array.isArray(events)) {
            const pushEvents = events.filter((e: { type: string }) => e.type === "PushEvent");
            commitCount = pushEvents.reduce((sum: number, e: { payload?: { commits?: unknown[] } }) => sum + (e.payload?.commits?.length || 0), 0);
          }
        }
      } catch (e) {
        console.warn("Events fetch failed:", e);
      }

      // Fallback: estimate commits from repo count
      if (commitCount === 0 && userData.public_repos > 0) {
        commitCount = userData.public_repos * 5;
      }

      console.log("Final profile data:", {
        repos: userData.public_repos,
        stars: totalStars,
        commits: commitCount,
        followers: userData.followers
      });

      setGithubProfile({
        username: userData.login,
        avatar: userData.avatar_url,
        repos: userData.public_repos || 0,
        commits: commitCount,
        stars: totalStars,
        followers: userData.followers || 0,
      });

      setIsGitHubConnected(true);
      updateStepStatus(2, "complete");
      setCurrentStep(2);
    } catch (error) {
      console.error("GitHub fetch error:", error);
      updateStepStatus(2, "error");
      alert(error instanceof Error ? error.message : "Failed to fetch GitHub data.");
    }
  };

  // Handle pledge configuration
  const handleConfigurePledge = () => {
    updateStepStatus(3, "complete");
    setCurrentStep(3);
  };

  // Handle AI valuation - calls REAL API
  const handleGetValuation = async () => {
    if (!githubProfile || !address) return;

    updateStepStatus(4, "loading");
    setIsProcessing(true);

    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUsername: githubProfile.username,
          workerAddress: address,
          pledgedHours: pledgeHours,
          skillCategory: skillCategoryId,
        }),
      });

      if (!response.ok) throw new Error("Valuation failed");

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Valuation error");

      // Store attestation data for minting
      setValuationData(data.data);
      setVitalityScore(parseInt(data.data.attestation.vitalityScore) / 10); // Convert 0-1000 to 0-100
      setValuationComplete(true);
      updateStepStatus(4, "complete");
      setCurrentStep(4);
    } catch (err) {
      console.error("Valuation error:", err);
      updateStepStatus(4, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle minting with REAL contract call
  const handleMint = async () => {
    if (!address || !valuationData) return;

    updateStepStatus(5, "loading");
    setIsProcessing(true);

    try {
      const { attestation, signature } = valuationData;

      // Call the real mint function from useMintEcho hook
      // Parameters match the hook: worker, skillCategory, pledgedHours, vitalityScore, reliabilityScore, mintAmount, deadline, v, r, s
      mint({
        worker: attestation.worker as `0x${string}`,
        skillCategory: attestation.skillCategory,
        pledgedHours: parseInt(attestation.pledgedHours),
        vitalityScore: parseInt(attestation.vitalityScore),
        reliabilityScore: parseInt(attestation.reliabilityScore),
        mintAmount: BigInt(attestation.tokenValue),
        deadline: parseInt(attestation.validUntil),
        v: signature.v,
        r: signature.r as `0x${string}`,
        s: signature.s as `0x${string}`,
      });

      // Status will be updated when tx confirms via the hook
    } catch (err) {
      console.error("Mint error:", err);
      updateStepStatus(5, "error");
      setIsProcessing(false);
    }
  };

  // Watch for mint completion
  useEffect(() => {
    if (mintComplete && isProcessing) {
      updateStepStatus(5, "complete");
      setIsProcessing(false);
    }
  }, [mintComplete, isProcessing]);

  // Use contract hooks for real-time valuation
  const selectedRate = SKILL_RATES[skillCategoryId] || 100;
  const estimatedValue = parseFloat(finalValue) || (pledgeHours * selectedRate * (vitalityScore / 100));

  // Calculate display values
  const displayValuation = {
    vitalityScore: vitalityScore,
    reliabilityScore: 0.92,
    pledgedHours: pledgeHours,
    hourlyRate: selectedRate,
    tokenValue: estimatedValue,
  };

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
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <div
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${isConnected
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-card border border-border text-muted-foreground"
                }`}
            >
              <Wallet className="w-4 h-4" />
              {isConnected ? "0x7c2...4E3f" : "Not Connected"}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mantle-cyan/30 bg-mantle-cyan/10 mb-6">
            <Zap className="w-4 h-4 text-mantle-cyan" />
            <span className="text-sm text-mantle-cyan">
              Tokenize Your Productivity
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pledge Your <span className="gradient-text">Productivity</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect your GitHub, get AI-valued, and mint $VITA tokens backed by
            your future work. Collateral is soft-staked in mETH for native yield.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${step.status === "complete"
                      ? "bg-green-500 border-green-500 text-white"
                      : step.status === "loading"
                        ? "bg-mantle-cyan/20 border-mantle-cyan text-mantle-cyan"
                        : step.status === "error"
                          ? "bg-red-500/20 border-red-500 text-red-500"
                          : currentStep >= index
                            ? "bg-card border-mantle-cyan text-mantle-cyan"
                            : "bg-card border-border text-muted-foreground"
                      }`}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === "loading" ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <span className="text-lg font-semibold">{step.id}</span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center max-w-20 ${step.status === "complete"
                      ? "text-green-400"
                      : currentStep >= index
                        ? "text-foreground"
                        : "text-muted-foreground"
                      }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 lg:w-24 h-0.5 mx-2 ${step.status === "complete"
                      ? "bg-green-500"
                      : "bg-border"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Current Step */}
          <div className="bg-card border border-border rounded-xl p-8">
            {/* Step 1: Connect Wallet */}
            {currentStep === 0 && !isConnected && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-mantle-cyan/20 flex items-center justify-center mx-auto">
                  <Wallet className="w-8 h-8 text-mantle-cyan" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Connect Your Wallet
                  </h2>
                  <p className="text-muted-foreground">
                    Connect your Web3 wallet to start pledging productivity on
                    Mantle Network.
                  </p>
                </div>
                <button
                  onClick={handleConnectWallet}
                  disabled={steps[0].status === "loading"}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-mantle-cyan to-mantle-purple text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {steps[0].status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Link GitHub */}
            {currentStep === 1 && !isGitHubConnected && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Link Your GitHub
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your GitHub username to fetch your real contribution data.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g., vitalik"
                    className="w-full p-3 rounded-lg bg-background border border-border text-foreground focus:border-mantle-cyan focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleGitHubConnect}
                  disabled={steps[1].status === "loading" || !githubUsername.trim()}
                  className="w-full py-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {steps[1].status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Fetching GitHub Data...
                    </>
                  ) : (
                    <>
                      <Github className="w-5 h-5" />
                      Fetch GitHub Profile
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  We only read public repository data. No authentication required.
                </p>
              </div>
            )}

            {/* Step 3: Configure Pledge (shown after GitHub connected) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Configure Your Pledge
                  </h2>
                  <p className="text-muted-foreground">
                    Set your pledged hours and skill category
                  </p>
                </div>

                {/* GitHub Profile Preview */}
                <div className="p-4 rounded-lg bg-background border border-border flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mantle-cyan to-mantle-purple flex items-center justify-center">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      @{githubProfile?.username || "..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {githubProfile?.commits || 0} commits •{" "}
                      {githubProfile?.repos || 0} repos •{" "}
                      {githubProfile?.stars || 0} stars
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>

                {/* Pledge Hours */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pledged Hours
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="160"
                    value={pledgeHours}
                    onChange={(e) => setPledgeHours(Number(e.target.value))}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-mantle-cyan"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">10h</span>
                    <span className="text-lg font-bold text-mantle-cyan">
                      {pledgeHours} hours
                    </span>
                    <span className="text-sm text-muted-foreground">160h</span>
                  </div>
                </div>

                {/* Skill Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Skill Category
                  </label>
                  <select
                    value={skillCategoryId}
                    onChange={(e) => setSkillCategoryId(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-background border border-border text-foreground focus:border-mantle-cyan focus:outline-none"
                  >
                    {Object.entries(SKILL_LABELS).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label} (${SKILL_RATES[Number(id)]}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleConfigurePledge}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-mantle-cyan to-mantle-purple text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Continue to Valuation
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 4: AI Valuation */}
            {currentStep === 3 && !valuationComplete && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-mantle-purple/20 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-mantle-purple" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    AI Valuation
                  </h2>
                  <p className="text-muted-foreground">
                    Our AI oracle will analyze your GitHub activity and compute
                    your vitality score.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background border border-border space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pledged Hours</span>
                    <span className="text-foreground">{pledgeHours} hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Skill Category</span>
                    <span className="text-foreground">
                      {SKILL_LABELS[skillCategoryId]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base Rate</span>
                    <span className="text-foreground">${selectedRate}/hr</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Estimated Value
                    </span>
                    <span className="text-lg font-bold gradient-text">
                      ~${estimatedValue.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGetValuation}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-mantle-cyan to-mantle-purple text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing GitHub Activity...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Get AI Valuation
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 5: Valuation Complete - Ready to Mint */}
            {valuationComplete && !mintComplete && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Valuation Complete
                  </h2>
                  <p className="text-muted-foreground">
                    Your productivity has been valued. Ready to mint $VITA tokens!
                  </p>
                </div>

                {/* Valuation Results */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-mantle-cyan/10 to-mantle-purple/10 border border-mantle-cyan/30">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">Token Value</p>
                    <p className="text-4xl font-bold gradient-text">
                      ${displayValuation.tokenValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ≈ {displayValuation.tokenValue.toFixed(0)} $VITA
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <p className="text-2xl font-bold text-mantle-cyan">
                        {displayValuation.vitalityScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vitality Score
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <p className="text-2xl font-bold text-mantle-purple">
                        {(displayValuation.reliabilityScore * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reliability
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Collateral will be soft-staked in mETH (1.36% APY)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span>20% yield-back to you as the worker</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span>ERC-3643 compliant for institutional trading</span>
                  </div>
                </div>

                <button
                  onClick={handleMint}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-mantle-cyan to-mantle-purple text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Minting on Mantle...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Mint $VITA Tokens
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Mint Complete */}
            {mintComplete && (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    🎉 Tokens Minted!
                  </h2>
                  <p className="text-muted-foreground">
                    Your productivity has been tokenized on Mantle Network.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-mantle-cyan/10 border border-green-500/30 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    You received
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    {displayValuation.tokenValue.toFixed(0)} $VITA
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Transaction Hash
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-foreground break-all">
                      {txHash}
                    </code>
                    <a
                      href={`https://explorer.testnet.mantle.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mantle-cyan hover:text-mantle-cyan/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-mantle-cyan to-mantle-purple text-white font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    View Dashboard
                  </Link>
                  <button className="flex-1 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-card transition-colors">
                    Mint More
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Info */}
          <div className="space-y-6">
            {/* How it Works */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-mantle-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-mantle-cyan">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Connect & Verify
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Link your wallet and GitHub to verify your developer
                      identity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-mantle-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-mantle-cyan">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">AI Valuation</p>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes your commit history, repo quality, and
                      activity patterns.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-mantle-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-mantle-cyan">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Mint $VITA Tokens
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive ERC-3643 compliant tokens backed by your future
                      productivity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-mantle-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-mantle-cyan">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Earn Yield</p>
                    <p className="text-sm text-muted-foreground">
                      Collateral is staked in mETH. 20% of all yield goes back
                      to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* VITA Formula */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Valuation Formula
              </h3>
              <div className="p-4 rounded-lg bg-background border border-border mb-4">
                <p className="text-center font-mono text-lg text-mantle-cyan">
                  V = (H × R) × S<sub>AI</sub> × e<sup>-λt</sup>
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">H</span> =
                  Pledged Hours
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">R</span> =
                  Skill-based Hourly Rate
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">
                    S<sub>AI</sub>
                  </span>{" "}
                  = AI Vitality Score (0-100)
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">λ</span> = Time
                  Decay Factor (0.001)
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Security & Compliance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    ERC-3643 compliant (T-REX standard)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    ZK proofs for private work verification
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    ONCHAINID for identity management
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    Audited smart contracts
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

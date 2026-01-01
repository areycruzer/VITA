import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValuationChart } from "@/components/dashboard/ValuationChart";
import { PledgeTable } from "@/components/dashboard/PledgeTable";
import { PledgeModal } from "@/components/dashboard/PledgeModal";
import { Activity, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your human capital assets and track performance.</p>
        </div>
        <PledgeModal />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Vitality */}
        <Card className="bg-card/50 backdrop-blur border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vitality
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">125,430</div>
            <p className="text-xs text-muted-foreground mt-1">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Est. Yield */}
        <Card className="bg-card/50 backdrop-blur border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Est. Yield (APY)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Paid in mETH
            </p>
          </CardContent>
        </Card>

        {/* Reliability Score */}
        <Card className="bg-card/50 backdrop-blur border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reliability Score
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">98.2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top 5% of Earners
            </p>
          </CardContent>
        </Card>

        {/* Available Credit */}
        <Card className="bg-card/50 backdrop-blur border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available to Mint
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">40hr</div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-verified by GitHub
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Chart (Takes 2 cols on LG) */}
        <div className="lg:col-span-2">
          <ValuationChart />
        </div>

        {/* Recent Activity or Info (Takes 1 col) */}
        <Card className="col-span-1 border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Protocol Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center rounded-lg border border-border p-3 bg-secondary/20">
                <span className="text-sm text-muted-foreground">METH Price</span>
                <span className="font-mono">$3,420.50</span>
              </div>
              <div className="flex justify-between items-center rounded-lg border border-border p-3 bg-secondary/20">
                <span className="text-sm text-muted-foreground">VITA Index</span>
                <span className="font-mono">1.04</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-2">Governance</h4>
                <p className="text-xs text-muted-foreground mb-3">Proposal #42: Increase base rate for AI Engineers is active.</p>
                <button className="text-xs text-primary hover:underline">Vote Now</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pledge Table */}
      <PledgeTable />
    </div>
  );
}

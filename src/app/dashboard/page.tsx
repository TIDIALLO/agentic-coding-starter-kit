"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, TrendingUp } from "lucide-react";
import { LineChart } from "@/components/charts/LineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import * as React from "react";
import { formatXOF } from "@/lib/currency";

export default function DashboardPage()
{
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access the dashboard
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const [loading, setLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState<{ totalIncomeMonth: number; totalExpensesMonth: number; netBalance: number; revenueTrend: { label: string; value: number; }[]; revenueByType: { label: string; value: number; }[]; } | null>(null);

  React.useEffect(() =>
  {
    let cancelled = false;
    async function load()
    {
      try {
        const res = await fetch("/api/dashboard/metrics", { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("metrics_unavailable");
        const json = await res.json();
        if (!cancelled) setMetrics(json);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400">Track your financial overview</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">TOTAL INCOME</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-300">{loading || !metrics ? "--" : formatXOF(metrics.totalIncomeMonth)}</div>
              <CardDescription className="mt-1 text-slate-500">This month</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">TOTAL EXPENSES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-300">{loading || !metrics ? "--" : formatXOF(metrics.totalExpensesMonth)}</div>
              <CardDescription className="mt-1 text-slate-500">This month</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-slate-400">NET BALANCE</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-300">{loading || !metrics ? "--" : `+${formatXOF(metrics.netBalance)}`}</div>
              <CardDescription className="mt-1 text-slate-500">Positive balance</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !metrics ? (
                <div className="h-[220px] flex items-center justify-center text-slate-500">{loading ? "Loading…" : "Service indisponible"}</div>
              ) : (
                <LineChart
                  className="w-full"
                  width={520}
                  height={220}
                  stroke="#22d3ee"
                  fill="rgba(34,211,238,0.12)"
                  points={metrics.revenueTrend.map((p, i) => ({ x: i, y: p.value }))}
                />
              )}
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !metrics ? (
                <div className="h-[220px] flex items-center justify-center text-slate-500">{loading ? "Loading…" : "Service indisponible"}</div>
              ) : (
                <DonutChart
                  data={(metrics.revenueByType.length ? metrics.revenueByType : [{ label: "uncategorized", value: 1 }]).map((d, idx) => ({
                    label: d.label,
                    value: d.value,
                    color: ["#818cf8", "#34d399", "#f59e0b", "#f472b6", "#22d3ee"][idx % 5],
                  }))}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

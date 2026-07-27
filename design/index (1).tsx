import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Users,
  Tags,
  BookMarked,
  TrendingUp,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { stats, loansOverTime, categoryDistribution, loans, books } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · BookManager Library" },
      { name: "description", content: "Overview of collection, loans and activity across the library." },
      { property: "og:title", content: "BookManager · Modern library management" },
      { property: "og:description", content: "A refined library management workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const recent = loans.slice(0, 5);
  const featured = books.slice(0, 4);

  return (
    <AppShell
      title="Overview"
      subtitle="A snapshot of activity across the library."
      actions={
        <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Add book
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total copies" value={stats.totalBooks} icon={BookOpen} delta={4.2} hint="vs last month" />
        <StatCard label="Titles" value={stats.titles} icon={BookMarked} delta={1.8} hint="new this month" />
        <StatCard label="Authors" value={stats.authors} icon={Users} delta={2.1} hint="in collection" />
        <StatCard label="Categories" value={stats.categories} icon={Tags} delta={0} hint="curated" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold">Loans & returns</h2>
              <p className="text-xs text-muted-foreground">Rolling 12 months of activity</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              <TrendingUp className="h-3 w-3" />
              +12.4%
            </span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loansOverTime} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 260)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Area type="monotone" dataKey="loans" stroke="#6366f1" strokeWidth={2} fill="url(#gLoans)" />
                <Area type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} fill="url(#gReturns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">By category</h2>
          <p className="text-xs text-muted-foreground">Distribution of titles</p>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  stroke="none"
                >
                  {categoryDistribution.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 260)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2">
            {categoryDistribution.slice(0, 5).map((c) => (
              <li key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="tabular-nums font-medium">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Recent loans</h2>
              <p className="text-xs text-muted-foreground">Latest activity across members</p>
            </div>
            <Link
              to="/loans"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recent.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-accent/40 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 text-xs font-medium ring-1 ring-border">
                  {l.member.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.book}</p>
                  <p className="truncate text-xs text-muted-foreground">Borrowed by {l.member}</p>
                </div>
                <div className="hidden sm:block text-xs text-muted-foreground tabular-nums">
                  Due {new Date(l.due).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Featured titles</h2>
              <p className="text-xs text-muted-foreground">Curated this week</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {featured.map((b) => (
              <li key={b.id} className="flex items-center gap-3">
                <div
                  className={`h-11 w-8 shrink-0 rounded-sm bg-gradient-to-br ${b.cover} ring-1 ring-border`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.author}</p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

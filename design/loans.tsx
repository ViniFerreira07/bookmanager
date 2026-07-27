import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { loans } from "@/lib/mock-data";

export const Route = createFileRoute("/loans")({
  head: () => ({
    meta: [
      { title: "Loans · BookManager Library" },
      { name: "description", content: "Active, overdue and returned loans across the library." },
      { property: "og:title", content: "Loans · BookManager" },
      { property: "og:description", content: "Track loans, due dates and returns." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoansPage,
});

function LoansPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "overdue" | "returned">("all");

  const filtered = useMemo(() => {
    return loans
      .filter((l) => (tab === "all" ? true : l.status === tab))
      .filter((l) => {
        const s = q.toLowerCase();
        return !s || l.book.toLowerCase().includes(s) || l.member.toLowerCase().includes(s);
      });
  }, [q, tab]);

  const counts = {
    all: loans.length,
    active: loans.filter((l) => l.status === "active").length,
    overdue: loans.filter((l) => l.status === "overdue").length,
    returned: loans.filter((l) => l.status === "returned").length,
  };

  return (
    <AppShell
      title="Loans"
      subtitle="Track lending activity across members"
      actions={
        <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          New loan
        </button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-md border border-border bg-card p-0.5 text-sm">
          {(["all", "active", "overdue", "returned"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 rounded-[6px] px-3 capitalize transition-colors ${
                tab === t ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex h-9 w-full sm:w-72 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search loans..."
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Book</th>
                <th className="px-5 py-3 text-left font-medium">Member</th>
                <th className="px-5 py-3 text-left font-medium">Borrowed</th>
                <th className="px-5 py-3 text-left font-medium">Due</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-5 py-3 font-medium">{l.book}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.member}</td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">
                    {new Date(l.borrowed).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">
                    {new Date(l.due).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

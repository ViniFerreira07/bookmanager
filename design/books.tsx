import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Download,
  Pencil,
  Trash2,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { books, categories } from "@/lib/mock-data";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Books · BookManager Library" },
      { name: "description", content: "Browse, search and manage the entire library catalog." },
      { property: "og:title", content: "Books · BookManager" },
      { property: "og:description", content: "Full catalog with search, filters and quick actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return books
      .filter((b) => (cat === "all" ? true : b.category === cat))
      .filter((b) => (status === "all" ? true : b.status === status))
      .filter(
        (b) =>
          !query ||
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.isbn.includes(query),
      )
      .sort((a, b) => (sortDir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
  }, [q, cat, status, sortDir]);

  return (
    <AppShell
      title="Books"
      subtitle={`${filtered.length} of ${books.length} titles in the catalog`}
      actions={
        <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Add book
        </button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author or ISBN..."
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="all">All status</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
          </select>
          <button
            aria-label="More filters"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            aria-label="Export"
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState onReset={() => { setQ(""); setCat("all"); setStatus("all"); }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 text-left font-medium">
                    <button
                      onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Title <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Author</th>
                  <th className="px-5 py-3 text-left font-medium">Category</th>
                  <th className="px-5 py-3 text-left font-medium">Year</th>
                  <th className="px-5 py-3 text-left font-medium">Copies</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((b) => (
                  <tr key={b.id} className="group hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-6 shrink-0 rounded-sm bg-gradient-to-br ${b.cover} ring-1 ring-border`} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{b.title}</p>
                          <p className="truncate text-xs text-muted-foreground font-mono">{b.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{b.author}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-md bg-accent px-2 py-0.5 text-xs">{b.category}</span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{b.year}</td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{b.copies}</td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            aria-label="Row actions"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem><BookOpen className="mr-2 h-4 w-4" />View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <BookOpen className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">No books match your filters</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Try adjusting your search or clearing the filters to see the full catalog.
      </p>
      <button
        onClick={onReset}
        className="mt-4 inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-accent transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}

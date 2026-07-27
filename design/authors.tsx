import { createFileRoute } from "@tanstack/react-router";
import { Plus, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { authors } from "@/lib/mock-data";

export const Route = createFileRoute("/authors")({
  head: () => ({
    meta: [
      { title: "Authors · BookManager Library" },
      { name: "description", content: "Authors represented across the collection." },
      { property: "og:title", content: "Authors · BookManager" },
      { property: "og:description", content: "Curated list of authors in the collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthorsPage,
});

function AuthorsPage() {
  return (
    <AppShell
      title="Authors"
      subtitle={`${authors.length} authors represented in the collection`}
      actions={
        <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          New author
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {authors.map((a) => (
          <div
            key={a.id}
            className="group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/25 text-sm font-medium ring-1 ring-border">
                {a.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.name}</p>
                <p className="truncate text-xs text-muted-foreground">{a.nationality}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {a.books} {a.books === 1 ? "title" : "titles"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider">{a.id}</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

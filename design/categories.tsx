import { createFileRoute } from "@tanstack/react-router";
import { Plus, Tags } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { categories, books } from "@/lib/mock-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories · BookManager Library" },
      { name: "description", content: "Categories organizing the library collection." },
      { property: "og:title", content: "Categories · BookManager" },
      { property: "og:description", content: "Curated categories across the collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const total = books.length;
  return (
    <AppShell
      title="Categories"
      subtitle={`${categories.length} categories organizing ${total} titles`}
      actions={
        <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          New category
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const share = Math.round((c.books / total) * 100);
          return (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div
                    className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset"
                    style={{
                      background: `color-mix(in oklab, ${c.color} 18%, transparent)`,
                      color: c.color,
                      borderColor: c.color,
                    }}
                  >
                    <Tags className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.books} titles in this category</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground tabular-nums">{share}%</span>
              </div>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${share}%`, background: c.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

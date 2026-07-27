import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Library, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · BookManager" },
      { name: "description", content: "Sign in to your BookManager library workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("lena@BookManager.io");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back", { description: "Redirecting to your dashboard..." });
      setTimeout(() => navigate({ to: "/" }), 400);
    }, 900);
  };

  return (
    <div className="dark relative flex min-h-dvh w-full bg-background text-foreground overflow-hidden">
      {/* Left brand pane */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between border-r border-border p-10 surface-grid">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
            <Library className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">BookManager</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            A calmer way to run <br />
            your library.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Manage catalogs, members and loans with the clarity and precision of a modern
            product — from the first search to the last return.
          </p>
          <div className="mt-8 flex items-center gap-2">
            {["#6366f1", "#10b981", "#f59e0b", "#ec4899"].map((c) => (
              <span key={c} className="h-1.5 w-8 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BookManager, Inc.</p>
      </div>

      {/* Right form pane */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
              <Library className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">BookManager</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back — enter your credentials to continue.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:opacity-80">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-card px-3 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="h-10 rounded-md border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
              Google
            </button>
            <button className="h-10 rounded-md border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            No account yet?{" "}
            <Link to="/" className="text-primary hover:opacity-80">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/email", label: "Smart Email Generator" },
  { to: "/planner", label: "AI Task Planner" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/responsible-ai", label: "Responsible AI" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex-1 space-y-1 px-4">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
              active
                ? "bg-secondary font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span
              className={`h-5 w-5 shrink-0 rounded-full ${
                active ? "bg-primary/20" : "border border-border"
              }`}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <>
      <div className="p-8 pb-6">
        <h1 className="font-display text-3xl text-primary">Bloom &amp; Elevate</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          AI Business Assistant
        </p>
      </div>
      <NavLinks onNavigate={onNavigate} />
      <div className="p-6">
        <div className="space-y-3 rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="text-xs uppercase tracking-widest opacity-80">Responsible AI</p>
          <p className="text-sm leading-relaxed">Human oversight is key to excellence.</p>
          <Link
            to="/responsible-ai"
            onClick={onNavigate}
            className="inline-block text-xs underline decoration-sand underline-offset-4"
          >
            View Guidelines
          </Link>
        </div>
      </div>
    </>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <SidebarInner />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-moss/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-slide-in-right flex-col bg-card shadow-lift">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="min-w-0 flex-1">
        <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary font-medium lg:flex">
            BE
          </div>
        </header>
        {children}
        <footer className="mt-12 border-t border-border px-6 py-12 sm:px-8">
          <div className="max-w-3xl">
            <h3 className="font-display mb-3 text-xs uppercase tracking-widest text-primary">
              Responsible AI Notice
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bloom &amp; Elevate AI provides AI-generated suggestions and content. Always review
              AI-generated outputs for accuracy, appropriateness and confidentiality before using
              them for client communication or business decisions.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
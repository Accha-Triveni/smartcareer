import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Menu,
  Moon,
  Sun,
  X,
  Compass,
  Home,
  ClipboardCheck,
  Map,
  Briefcase,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { useStored } from "@/lib/storage";
import type { Profile } from "@/lib/career-data";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assessment", label: "Assessment", icon: ClipboardCheck },
  { to: "/careers", label: "Career Paths", icon: Compass },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

const MOBILE_BOTTOM_TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assessment", label: "Assess", icon: ClipboardCheck },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/careers", label: "Careers", icon: Compass },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [profile] = useStored<Profile | null>("careerai-profile", null);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const d = localStorage.getItem("careerai-theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("careerai-theme", d ? "dark" : "light");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-base sm:text-lg font-bold">
            <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Compass className="h-4 w-4" />
            </span>
            <span>
              Career<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground bg-secondary font-semibold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 hover:bg-secondary text-foreground transition-colors"
            >
              {dark ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </button>

            <Link
              to="/assessment"
              className="hidden rounded-lg bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm sm:inline-flex items-center gap-1.5 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{profile ? "Retake Test" : "Get Started"}</span>
            </Link>

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Open navigation menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/60 hover:bg-secondary text-foreground md:hidden transition-colors"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down / Dropdown Navigation */}
        {open && (
          <div className="border-t bg-card/95 backdrop-blur-md px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
            {profile && (
              <div className="mb-3 flex items-center justify-between rounded-xl bg-secondary/70 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{profile.name}</p>
                    <p className="text-[11px] text-muted-foreground">{profile.education} · {profile.interest || "Student"}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-background px-2.5 py-1 font-semibold text-primary shadow-xs"
                >
                  Dashboard
                </Link>
              </div>
            )}

            <nav className="space-y-1">
              {NAV.map((n) => {
                const Icon = n.icon;
                const isActive = currentPath === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      {n.label}
                    </span>
                    <span className="text-xs opacity-60">→</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t pt-3">
              <Link
                to="/assessment"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                {profile ? "Retake Career Assessment" : "Start Free Assessment"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with Mobile Bottom Nav Clearance */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Fixed Mobile Bottom Navigation Bar (Dock) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-lg px-2 py-1.5 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {MOBILE_BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`relative flex min-w-[50px] flex-col items-center justify-center rounded-xl py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? "font-bold text-primary"
                    : "text-muted-foreground hover:text-foreground active:scale-95"
                }`}
              >
                <div
                  className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                    isActive ? "bg-primary/15 text-primary scale-110" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="mt-0.5 tracking-tight leading-none">{tab.label}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 h-1 w-5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t bg-hero text-hero-foreground pb-20 md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-12 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">CareerAI</p>
            <p className="mt-2 text-sm opacity-75 leading-relaxed">
              Know your skills. Find your path. Build your future with interactive weekly roadmaps.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Explore</p>
            <div className="grid grid-cols-2 gap-1 sm:block">
              {NAV.slice(1).map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="block py-1 opacity-70 hover:opacity-100 transition-opacity"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-sm opacity-75">
            <p className="mb-2 font-semibold opacity-100">Contact</p>
            <p>hello@careerai.app</p>
            <p className="mt-3">© 2026 CareerAI. Fully mobile-ready for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 pb-6 pt-6 sm:pb-8 sm:pt-10">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-1.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
        {text}
      </p>
    </div>
  );
}

export function Bar({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "accent" | "success";
}) {
  const cls =
    tone === "accent" ? "bg-accent" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${cls} transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

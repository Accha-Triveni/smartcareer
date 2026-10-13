import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, AlertTriangle, Target, BarChart3, Map, Briefcase } from "lucide-react";
import { CAREERS } from "@/lib/career-data";
import { Bar } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerAI – Build Your Career with AI" },
      { name: "description", content: "Assess your skills, discover matching careers and follow a personalised learning roadmap to become job-ready." },
      { property: "og:title", content: "CareerAI – Build Your Career with AI" },
      { property: "og:description", content: "Assess your skills, discover matching careers and follow a personalised roadmap." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="bg-hero text-hero-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border border-hero-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">Smart Career & Skill Planner</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">Build your career <span className="text-accent">with AI.</span></h1>
            <p className="mt-6 max-w-lg text-lg opacity-80">Discover the right career path, identify your skill gaps, and create a personalised roadmap to become job-ready.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/assessment" className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90">Start Assessment <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/careers" className="rounded-md border border-hero-foreground/30 px-6 py-3 font-semibold hover:bg-hero-foreground/10">Explore Careers</Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm opacity-80">
              <div><p className="font-display text-2xl font-bold text-hero-foreground">6</p>career paths</div>
              <div><p className="font-display text-2xl font-bold text-hero-foreground">30+</p>skills mapped</div>
              <div><p className="font-display text-2xl font-bold text-hero-foreground">4 min</p>assessment</div>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Career Analysis</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="font-display text-xl font-bold">Data Analyst</p>
              <p className="font-display text-3xl font-extrabold text-primary">92%</p>
            </div>
            <div className="mt-3"><Bar value={92} /></div>
            <p className="mt-6 text-sm font-semibold">Skills match</p>
            <ul className="mt-3 space-y-2 text-sm">
              {["Python", "SQL", "Excel"].map((s) => (
                <li key={s} className="flex items-center justify-between rounded-md bg-muted px-3 py-2">{s}<Check className="h-4 w-4 text-success" /></li>
              ))}
              <li className="flex items-center justify-between rounded-md bg-muted px-3 py-2">Power BI<AlertTriangle className="h-4 w-4 text-warning" /></li>
            </ul>
            <Link to="/roadmap" className="mt-6 block rounded-md bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">View Roadmap</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">How CareerAI works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["01", "Assess", "Tell CareerAI about your skills, interests and experience."],
            ["02", "Discover", "Get career recommendations and understand your skill gaps."],
            ["03", "Grow", "Follow your personalised roadmap and track your progress."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-xl border bg-card p-6">
              <p className="font-display text-4xl font-extrabold text-accent">{n}</p>
              <h3 className="mt-4 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold">Popular career paths</h2>
            <Link to="/careers" className="text-sm font-semibold text-primary">See all paths →</Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAREERS.slice(0, 4).map((c) => (
              <div key={c.id} className="flex flex-col rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="text-3xl">{c.emoji}</span>
                <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.skills.slice(0, 4).join(" • ")}</p>
                <Link to="/careers" className="mt-4 text-sm font-semibold text-primary">Explore career →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">Why CareerAI?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Target, "Personalised suggestions", "Careers ranked by your real skills and interests."],
            [BarChart3, "Skill gap analysis", "See exactly what you have and what's missing."],
            [Map, "Learning roadmap", "A step-by-step plan with progress tracking."],
            [Briefcase, "Job explorer", "Search and filter roles that match your profile."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Target;
            return (
              <div key={t as string} className="rounded-xl border bg-card p-6">
                <I className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-bold">{t as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-16 rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Ready to find your path?</h2>
          <p className="mt-3 opacity-80">Take the free 4-minute assessment and get your personalised career report.</p>
          <Link to="/assessment" className="mt-6 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground">Start Assessment</Link>
        </div>
      </section>
    </>
  );
}

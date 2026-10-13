import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, Sparkles, Bot, Loader2, RefreshCw, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { Bar, PageHeader } from "@/components/SiteLayout";
import { matchCareers, type Profile } from "@/lib/career-data";
import { useStored } from "@/lib/storage";
import { generateAICareerAdvice, isOpenAIConfigured } from "@/lib/openai";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Career Matches – CareerAI" },
      { name: "description", content: "Your personalised career recommendations with skill match and skill gap analysis." },
      { property: "og:title", content: "Your Career Matches – CareerAI" },
      { property: "og:description", content: "Personalised career recommendations and skill gaps." },
    ],
  }),
  component: Results,
});

function Results() {
  const [profile, , ready] = useStored<Profile | null>("careerai-profile", null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [adviceSource, setAdviceSource] = useState<"openai" | "fallback">("fallback");
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  const matched = profile ? matchCareers(profile) : [];
  const top = matched[0];

  useEffect(() => {
    if (!profile || !top) return;

    let isMounted = true;
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const fallback = `• Priority 1: Bridge your key gap in ${top.missing[0] || "core tools"} through 3 hands-on mini-projects.\n• Priority 2: Package your existing skills (${top.have.slice(0, 2).join(", ") || "analytical thinking"}) into a live GitHub portfolio.\n• Priority 3: Leverage CareerAI's Jobs Copilot to target entry-level positions on LinkedIn and Unstop with tailored cover letters.`;
      
      try {
        const res = await generateAICareerAdvice(
          profile,
          top.career.title,
          top.score,
          top.have,
          top.missing,
          fallback
        );
        if (isMounted) {
          setAiAdvice(res.text);
          setAdviceSource(res.source);
        }
      } catch {
        if (isMounted) {
          setAiAdvice(fallback);
          setAdviceSource("fallback");
        }
      } finally {
        if (isMounted) {
          setLoadingAdvice(false);
        }
      }
    };

    fetchAdvice();
    return () => {
      isMounted = false;
    };
  }, [profile?.name, top?.career?.id]);

  if (!ready) return <div className="min-h-[60vh]" />;
  if (!profile)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">No assessment yet</h1>
        <p className="mt-3 text-muted-foreground">Take the assessment to see your career matches.</p>
        <Link to="/assessment" className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground">Start Assessment</Link>
      </div>
    );

  const rest = matched.slice(1);

  return (
    <div className="pb-20">
      <PageHeader eyebrow="Your report" title={`Hi ${profile.name.split(" ")[0]}, here are your matches`} text="Ranked by how well your current skills and interests fit each career." />
      <div className="mx-auto grid max-w-6xl gap-6 px-3 sm:px-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-hero p-5 sm:p-8 text-hero-foreground lg:col-span-2 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Best match</p>
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold">{top.career.emoji} {top.career.title}</h2>
            <p className="font-display text-3xl sm:text-5xl font-extrabold text-accent shrink-0">{top.score}%</p>
          </div>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm opacity-85 leading-relaxed">{top.career.summary}</p>
          <div className="mt-6 grid gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-hero-foreground/5 p-4 border border-hero-foreground/10">
              <p className="text-xs sm:text-sm font-semibold text-accent">Skills you have</p>
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm">{top.have.length ? top.have.map((s) => <li key={s} className="flex items-center gap-2"><Check className="h-4 w-4 text-success shrink-0" />{s}</li>) : <li className="opacity-70">None yet</li>}</ul>
            </div>
            <div className="rounded-xl bg-hero-foreground/5 p-4 border border-hero-foreground/10">
              <p className="text-xs sm:text-sm font-semibold text-warning">Skill gap to bridge</p>
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm">{top.missing.length ? top.missing.map((s) => <li key={s} className="flex items-center gap-2"><X className="h-4 w-4 text-warning shrink-0" />{s}</li>) : <li className="opacity-70">No gaps 🎉</li>}</ul>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/roadmap"
              search={{ career: top.career.id }}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3.5 font-bold text-accent-foreground shadow-md hover:opacity-90 active:scale-95 transition text-center"
            >
              Generate My Roadmap →
            </Link>
            <Link to="/jobs" className="inline-flex items-center justify-center rounded-xl bg-hero-foreground/10 border border-hero-foreground/20 px-6 py-3.5 font-bold text-hero-foreground hover:bg-hero-foreground/20 transition text-center gap-2">
              <Briefcase className="h-4 w-4" /> Explore Real-Time Jobs
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm">
          <p className="font-bold">Other matches</p>
          <ul className="mt-4 space-y-5">
            {rest.map((m) => (
              <li key={m.career.id} className="group">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{m.career.emoji} {m.career.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-muted-foreground">{m.score}%</span>
                    <Link
                      to="/roadmap"
                      search={{ career: m.career.id }}
                      className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition hover:underline"
                    >
                      Roadmap →
                    </Link>
                  </div>
                </div>
                <Bar value={m.score} tone="accent" />
              </li>
            ))}
          </ul>
          <Link to="/assessment" className="mt-6 block text-sm font-semibold text-primary">Retake assessment →</Link>
        </div>

        {/* AI Career Coach Strategic Advice Card */}
        <div className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-7 shadow-sm lg:col-span-3 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  AI Career Coach Strategic Analysis
                </h3>
                <p className="text-xs text-muted-foreground">
                  Personalized career recommendations synthesized for your profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                adviceSource === "openai"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}>
                <Sparkles className="h-3 w-3" />
                {adviceSource === "openai" ? "Powered by OpenAI GPT-4o-mini" : "CareerAI Intelligence"}
              </span>
              <button
                type="button"
                onClick={async () => {
                  setLoadingAdvice(true);
                  const fallback = `• Priority 1: Focus next 30 days on ${top.missing[0] || "core tools"} projects.\n• Priority 2: Add 2 completed projects to your resume.\n• Priority 3: Apply directly to live listings in the Jobs section.`;
                  try {
                    const res = await generateAICareerAdvice(profile, top.career.title, top.score, top.have, top.missing, fallback);
                    setAiAdvice(res.text);
                    setAdviceSource(res.source);
                  } finally {
                    setLoadingAdvice(false);
                  }
                }}
                disabled={loadingAdvice}
                className="rounded-lg border p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                title="Regenerate strategic advice"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingAdvice ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {loadingAdvice ? (
            <div className="py-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Analyzing market requirements with OpenAI...</span>
            </div>
          ) : (
            <div className="rounded-xl bg-secondary/30 p-4 border text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
              {aiAdvice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

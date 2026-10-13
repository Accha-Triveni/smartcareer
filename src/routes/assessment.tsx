import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Check,
  ChevronRight,
  Briefcase,
  Layers,
  Code2,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/SiteLayout";
import {
  ALL_INTERESTS,
  ALL_SKILLS,
  CAREER_AREAS,
  type CareerAreaOption,
  type CareerStream,
  type Profile,
} from "@/lib/career-data";
import { syncProfileToSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Career Assessment – CareerAI" },
      {
        name: "description",
        content:
          "Answer four quick steps about your education (B.Tech, MCA, MBA), skills and interests to get career recommendations.",
      },
      { property: "og:title", content: "Career Assessment – CareerAI" },
      {
        property: "og:description",
        content:
          "AI-driven 4-step assessment matching B.Tech, MCA, MBA & graduate profiles with modern tech careers.",
      },
    ],
  }),
  component: Assessment,
});

const STEPS = ["Basic info", "Career area", "Skills", "Interests"];
const input =
  "w-full rounded-xl border bg-background px-3.5 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring transition shadow-xs";

function Chip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[38px] rounded-full border px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition active:scale-95 ${
        on
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card hover:bg-secondary text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Assessment() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [p, setP] = useState<Profile>({
    name: "",
    education: "",
    experience: "Fresher",
    interest: "",
    skills: [],
    interests: [],
  });

  // Stream Tab Filter in Step 1
  const [selectedStreamTab, setSelectedStreamTab] = useState<string>("All");

  // Auto-sync stream tab when education is picked
  useEffect(() => {
    if (p.education === "B.Tech / B.E.") {
      setSelectedStreamTab("B.Tech / Engineering");
    } else if (p.education === "MCA") {
      setSelectedStreamTab("MCA / Applications");
    } else if (p.education === "MBA") {
      setSelectedStreamTab("MBA / Management");
    }
  }, [p.education]);

  const toggle = (k: "skills" | "interests", v: string) =>
    setP({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] });

  const validate = () => {
    if (step === 0 && (p.name.trim().length < 2 || !p.education))
      return "Please enter your name and select your education degree.";
    if (step === 1 && !p.interest)
      return "Please choose the career area that excites you most.";
    if (step === 2 && p.skills.length === 0)
      return "Select at least one skill you already have or are learning.";
    if (step === 3 && p.interests.length === 0)
      return "Select at least one interest to help refine your match.";
    return "";
  };

  const next = () => {
    const e = validate();
    setError(e);
    if (e) return;
    if (step < 3) setStep(step + 1);
    else {
      localStorage.setItem("careerai-profile", JSON.stringify(p));
      syncProfileToSupabase(p);
      nav({ to: "/results" });
    }
  };

  const filteredAreas = useMemo(() => {
    if (selectedStreamTab === "All") return CAREER_AREAS;
    return CAREER_AREAS.filter((area) => area.stream === selectedStreamTab);
  }, [selectedStreamTab]);

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Step-by-step Career Fit"
        title="Career Assessment"
        text="Answer four quick questions. We'll analyze your degree, skills, and ambitions against tailored B.Tech, MCA, MBA, and tech career paths."
      />
      <div className="mx-auto max-w-3xl px-3 sm:px-4">
        {/* Step Progress Tracker */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <div key={s}>
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
              <p
                className={`mt-2 text-[11px] sm:text-xs truncate ${
                  i === step ? "font-bold text-primary" : "text-muted-foreground"
                }`}
              >
                {i + 1}. {s}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border bg-card p-4 sm:p-8 shadow-sm">
          {/* STEP 0: BASIC INFO */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Tell us about yourself</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  We customize career paths based on your academic background and experience.
                </p>
              </div>

              <label className="block text-sm font-semibold text-foreground">
                Full name
                <input
                  className={`${input} mt-1.5`}
                  value={p.name}
                  maxLength={60}
                  onChange={(e) => setP({ ...p, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                />
              </label>

              <label className="block text-sm font-semibold text-foreground">
                Highest Education / Degree
                <select
                  className={`${input} mt-1.5`}
                  value={p.education}
                  onChange={(e) => setP({ ...p, education: e.target.value })}
                >
                  <option value="">Select your degree…</option>
                  {[
                    "B.Tech / B.E.",
                    "MCA",
                    "MBA",
                    "BCA",
                    "B.Sc",
                    "M.Tech",
                    "Other Degree",
                  ].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>

              <div className="text-sm font-semibold text-foreground">
                Current Experience Level
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Fresher", "< 1 year", "1–3 years", "3+ years"].map((o) => (
                    <Chip
                      key={o}
                      label={o}
                      on={p.experience === o}
                      onClick={() => setP({ ...p, experience: o })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: CAREER AREA (SEPARATED B.TECH, MCA, MBA & CROSS-DISCIPLINARY) */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Which career area excites you most?
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Browse specialized tracks curated for B.Tech, MCA, MBA, and data/design domains.
                  </p>
                </div>
                {p.interest && (
                  <span className="self-start sm:self-auto rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary flex items-center gap-1">
                    <Check className="h-3 w-3" /> Selected
                  </span>
                )}
              </div>

              {/* Stream Switcher Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: "All", label: "All Areas", emoji: "🌐" },
                  { id: "B.Tech / Engineering", label: "B.Tech Engineering", emoji: "🎓" },
                  { id: "MCA / Applications", label: "MCA Applications", emoji: "💻" },
                  { id: "MBA / Management", label: "MBA Management", emoji: "📊" },
                  { id: "Cross-Disciplinary", label: "Data & Design", emoji: "🎨" },
                ].map((tab) => {
                  const isActive = selectedStreamTab === tab.id;
                  const isUserStream =
                    (tab.id === "B.Tech / Engineering" && p.education === "B.Tech / B.E.") ||
                    (tab.id === "MCA / Applications" && p.education === "MCA") ||
                    (tab.id === "MBA / Management" && p.education === "MBA");

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedStreamTab(tab.id)}
                      className={`rounded-xl px-3.5 py-2 font-bold transition flex items-center gap-1.5 shrink-0 border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                      {isUserStream && !isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Your Degree Stream" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Grid of Separated Career Areas */}
              <div className="grid gap-3 sm:grid-cols-2 pt-1 max-h-[460px] overflow-y-auto pr-1">
                {filteredAreas.map((area) => {
                  const isSelected = p.interest === area.name;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => {
                        setP({ ...p, interest: area.name });
                        setError("");
                      }}
                      className={`relative rounded-2xl border p-4 text-left transition flex flex-col justify-between gap-3 group ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                          : "border-border bg-card hover:bg-secondary/60 hover:border-border/80"
                      }`}
                    >
                      <div>
                        {/* Header: Emoji & Stream Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-2xl">{area.emoji}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            area.stream === "B.Tech / Engineering"
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                              : area.stream === "MCA / Applications"
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                              : area.stream === "MBA / Management"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          }`}>
                            {area.badge}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="mt-2.5 font-bold text-sm sm:text-base text-foreground leading-snug">
                          {area.name}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {area.description}
                        </p>
                      </div>

                      {/* Footer: Popular Roles */}
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-[11px] text-muted-foreground/90 flex flex-wrap items-center gap-1">
                          <span className="font-semibold text-foreground/80">Key Roles:</span>
                          {area.popularRoles.slice(0, 2).map((role, idx) => (
                            <span key={role} className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                              {role}
                            </span>
                          ))}
                        </p>
                      </div>

                      {/* Selection Checkmark */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Which skills do you already have?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select your existing skills ({p.skills.length} selected). We will map them against your target role to highlight mastered skills vs. roadmap learning gaps.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto pr-1 pt-1">
                {ALL_SKILLS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    on={p.skills.includes(s)}
                    onClick={() => toggle("skills", s)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: INTERESTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">What types of work do you enjoy?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select topics and workflows that align with your ambitions ({p.interests.length} selected). Used to generate your personalized weekly learning roadmap with YouTube tutorials.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {ALL_INTERESTS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    on={p.interests.includes(s)}
                    onClick={() => toggle("interests", s)}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm font-semibold text-destructive animate-in fade-in">
              {error}
            </p>
          )}

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => {
                setError("");
                setStep(step - 1);
              }}
              className="min-h-[44px] rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-30 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              className="min-h-[44px] rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 active:scale-95 transition inline-flex items-center gap-1.5"
            >
              <span>{step === 3 ? "Generate My Roadmap & Matches" : "Next Step"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

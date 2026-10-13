import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/SiteLayout";
import { CAREERS } from "@/lib/career-data";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Career Paths – CareerAI" },
      { name: "description", content: "Explore career paths in data, software, cloud and design with required skills and salary ranges." },
      { property: "og:title", content: "Career Paths – CareerAI" },
      { property: "og:description", content: "Explore careers, required skills and salary ranges." },
    ],
  }),
  component: Careers,
});

const CATS = [
  "All",
  "B.Tech",
  "MCA",
  "MBA",
  "Software",
  "Data",
  "Cloud",
  "Management",
  "Security",
  "Mobile",
  "Design",
] as const;

function Careers() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");

  const list = CAREERS.filter((c) => {
    let matchesCat = cat === "All";
    if (cat === "B.Tech" || cat === "MCA" || cat === "MBA") {
      matchesCat = Boolean(c.degreeFit?.includes(cat));
    } else if (cat !== "All") {
      matchesCat = c.category === cat;
    }

    const matchesQuery = (
      c.title +
      " " +
      c.summary +
      " " +
      (c.stream || "") +
      " " +
      c.skills.join(" ")
    )
      .toLowerCase()
      .includes(q.toLowerCase());

    return matchesCat && matchesQuery;
  });

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore Career Paths"
        title="Career Paths for B.Tech, MCA, MBA & Tech"
        text="Browse 18 curated technical and management career paths with required skills, stream alignment, and fresher salary benchmarks."
      />
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search careers, skills, or degree streams…"
              className="w-full rounded-xl border bg-card py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card hover:bg-secondary text-foreground"
                }`}
              >
                {c === "B.Tech" ? "🎓 B.Tech" : c === "MCA" ? "💻 MCA" : c === "MBA" ? "📊 MBA" : c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl">{c.emoji}</span>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {c.stream && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                      c.stream === "B.Tech / Engineering"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25"
                        : c.stream === "MCA / Applications"
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25"
                        : c.stream === "MBA / Management"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                    }`}>
                      {c.stream.split(" / ")[0]}
                    </span>
                  )}
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border">
                    {c.category}
                  </span>
                </div>
              </div>

              <h3 className="mt-3.5 text-xl font-bold text-foreground leading-snug">
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-xs text-muted-foreground leading-relaxed">
                {c.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <span key={s} className="rounded-md bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Fresher CTC:</span>
                  <span className="font-extrabold text-foreground">{c.salary}</span>
                </div>
                <Link
                  to="/assessment"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Check my fit →
                </Link>
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No careers match your search criteria. Try a different filter or search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

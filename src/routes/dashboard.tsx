import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, PageHeader } from "@/components/SiteLayout";
import { matchCareers, ROADMAP, type Profile } from "@/lib/career-data";
import { useStored } from "@/lib/storage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard – CareerAI" },
      { name: "description", content: "Track your career readiness, skills and roadmap progress in one place." },
      { property: "og:title", content: "Dashboard – CareerAI" },
      { property: "og:description", content: "Track your career readiness and roadmap progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [profile] = useStored<Profile | null>("careerai-profile", null);
  const [done] = useStored<string[]>("careerai-roadmap", []);
  const top = profile ? matchCareers(profile)[0] : null;
  const pct = Math.round((done.length / ROADMAP.length) * 100);
  const next = ROADMAP.filter((r) => !done.includes(r.id)).slice(0, 3);
  const stats = [
    ["Career match", top ? `${top.score}%` : "—"],
    ["Skills known", profile ? String(profile.skills.length) : "0"],
    ["Skill gaps", top ? String(top.missing.length) : "—"],
    ["Roadmap done", `${pct}%`],
  ];
  return (
    <div className="pb-20">
      <PageHeader eyebrow="Overview" title={profile ? `Welcome back, ${profile.name.split(" ")[0]}` : "Your Dashboard"} text={top ? `Target role: ${top.career.title}` : "Complete the assessment to personalise your dashboard."} />
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(([l, v]) => (
            <div key={l} className="rounded-xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">{l}</p>
              <p className="mt-2 font-display text-3xl font-extrabold">{v}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-bold">Progress</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div><div className="mb-1.5 flex justify-between"><span>Roadmap</span><span>{pct}%</span></div><Bar value={pct} tone="success" /></div>
              <div><div className="mb-1.5 flex justify-between"><span>Career readiness</span><span>{top?.score ?? 0}%</span></div><Bar value={top?.score ?? 0} /></div>
            </div>
            {!profile && <Link to="/assessment" className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Take assessment</Link>}
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-bold">Recommended next steps</h2>
            <ul className="mt-4 space-y-3">
              {next.map((r) => (
                <li key={r.id} className="rounded-md bg-muted px-4 py-3 text-sm"><span className="font-semibold">{r.title}</span> <span className="text-muted-foreground">· {r.weeks} weeks</span></li>
              ))}
              {next.length === 0 && <li className="text-sm text-muted-foreground">Roadmap complete — start applying on the Jobs page!</li>}
            </ul>
            <Link to="/roadmap" className="mt-4 inline-block text-sm font-semibold text-primary">Open roadmap →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  BookOpen,
  Code,
  ExternalLink,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  Layers,
  ListChecks,
  Award,
  ArrowRight,
  RotateCcw,
  Search,
  CheckSquare,
  Square,
  Youtube,
  Play,
  X,
  FileText,
  Upload,
  Trash2,
  Download,
  FileCheck,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Target,
  Zap,
  TrendingUp,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { Bar, PageHeader } from "@/components/SiteLayout";
import {
  CAREER_ROADMAPS,
  ROADMAP,
  CAREERS,
  CAREER_AREAS,
  scoreCareers,
  getRoadmapForCareer,
  type RoadmapMilestone,
  type WeekItem,
  type Profile,
  type Career,
} from "@/lib/career-data";
import { useStored } from "@/lib/storage";
import { syncResumeToSupabase, syncRoadmapProgressToSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/roadmap")({
  validateSearch: (search: Record<string, unknown>): { career?: string } => {
    return {
      career: typeof search.career === "string" ? search.career : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Weekly Learning Roadmap – CareerAI" },
      {
        name: "description",
        content:
          "Comprehensive week-by-week learning roadmaps tailored for B.Tech, MCA, MBA, and Design careers with YouTube tutorials, deliverables, and progress tracking.",
      },
      { property: "og:title", content: "Weekly Learning Roadmap – CareerAI" },
      {
        property: "og:description",
        content: "Week-by-week roadmap with curated curriculum, YouTube video lectures, and progress tracking.",
      },
    ],
  }),
  component: Roadmap,
});

export type UploadedResume = {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  dataUrl?: string;
};

function Roadmap() {
  const [profile] = useStored<Profile | null>("careerai-profile", null);
  const [completedMilestones, setCompletedMilestones] = useStored<string[]>(
    "careerai-roadmap",
    []
  );
  const [completedWeeks, setCompletedWeeks] = useStored<string[]>(
    "careerai-roadmap-weeks",
    []
  );
  const [completedTasks, setCompletedTasks] = useStored<string[]>(
    "careerai-roadmap-tasks",
    []
  );
  const [resume, setResume] = useStored<UploadedResume | null>("careerai-resume", null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit. Please upload a smaller resume.");
      return;
    }

    const validExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      toast.error("Please upload a valid document (.pdf, .docx, .doc, or .txt)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const formattedSize =
        file.size < 1024 * 1024
          ? `${Math.round(file.size / 1024)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const newResume: UploadedResume = {
        name: file.name,
        size: formattedSize,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        dataUrl: reader.result as string,
      };

      setResume(newResume);
      syncResumeToSupabase(newResume);
      toast.success(`Resume "${file.name}" uploaded successfully from your laptop!`);
    };

    reader.onerror = () => {
      toast.error("Failed to read resume file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveResume = () => {
    if (window.confirm("Are you sure you want to remove your uploaded resume?")) {
      setResume(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.info("Uploaded resume removed.");
    }
  };

  const handleDownloadResume = () => {
    if (!resume || !resume.dataUrl) return;
    const a = document.createElement("a");
    a.href = resume.dataUrl;
    a.download = resume.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const search = Route.useSearch();

  // Top career match from profile assessment
  const topAssessedMatch = useMemo(() => {
    if (!profile) return null;
    const scored = scoreCareers(profile);
    return scored.length > 0 ? scored[0] : null;
  }, [profile]);

  // Default track prioritizes URL query param, then top match from assessment, then fallback
  const defaultTrack = useMemo(() => {
    if (search?.career && (CAREER_ROADMAPS[search.career] || CAREERS.some((c) => c.id === search.career))) {
      return search.career;
    }
    if (typeof window !== "undefined") {
      const urlCareer = new URLSearchParams(window.location.search).get("career");
      if (urlCareer && (CAREER_ROADMAPS[urlCareer] || CAREERS.some((c) => c.id === urlCareer))) {
        return urlCareer;
      }
    }
    if (topAssessedMatch?.career?.id) {
      return topAssessedMatch.career.id;
    }
    return "software-developer";
  }, [search?.career, topAssessedMatch]);

  const [activeTrack, setActiveTrack] = useState<string>(defaultTrack);
  const [selectedStream, setSelectedStream] = useState<string>("All");

  // Sync active track if URL query param changes
  useEffect(() => {
    if (search?.career && (CAREER_ROADMAPS[search.career] || CAREERS.some((c) => c.id === search.career))) {
      setActiveTrack(search.career);
    }
  }, [search?.career]);

  // Current career metadata
  const currentCareer: Career = useMemo(() => {
    return (
      CAREERS.find((c) => c.id === activeTrack) ||
      CAREERS.find((c) => c.id === "software-developer") ||
      CAREERS[0]
    );
  }, [activeTrack]);

  // Skill analysis: user skills vs. target role skills
  const skillAnalysis = useMemo(() => {
    if (!currentCareer) return { have: [] as string[], toLearn: [] as string[], percentage: 0 };
    const userSkills = profile?.skills || [];
    const have = currentCareer.skills.filter((s) => userSkills.includes(s));
    const toLearn = currentCareer.skills.filter((s) => !userSkills.includes(s));
    const percentage =
      currentCareer.skills.length > 0
        ? Math.round((have.length / currentCareer.skills.length) * 100)
        : 0;
    return { have, toLearn, percentage };
  }, [currentCareer, profile]);

  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    r1: true,
    r2: true,
    r3: true,
    r4: true,
    r5: true,
    r6: true,
    r7: true,
    "fe-r1": true,
    "fe-r2": true,
    "fe-r3": true,
    "fe-r4": true,
    "fe-r5": true,
  });
  const [playingVideoWeek, setPlayingVideoWeek] = useState<string | null>(null);

  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
  };

  const milestones: RoadmapMilestone[] = useMemo(() => {
    return getRoadmapForCareer(activeTrack);
  }, [activeTrack]);

  // Flatten all weeks in current track
  const allWeeks: (WeekItem & { milestoneId: string; phase: string; milestoneTitle: string })[] =
    useMemo(() => {
      return milestones.flatMap((m) =>
        m.weeklyContent.map((w) => ({
          ...w,
          milestoneId: m.id,
          phase: m.phase,
          milestoneTitle: m.title,
        }))
      );
    }, [milestones]);

  const totalHours = useMemo(() => {
    return allWeeks.reduce((acc, curr) => acc + curr.estimatedHours, 0);
  }, [allWeeks]);

  // Check if a week is complete
  const isWeekComplete = (weekId: string, _milestoneId?: string) => {
    return completedWeeks.includes(weekId);
  };

  const allWeeksCount = allWeeks.length;
  const doneWeeksCount = allWeeks.filter((w) => isWeekComplete(w.id, w.milestoneId)).length;
  const isAllWeeksCompleted = allWeeksCount > 0 && doneWeeksCount === allWeeksCount;

  // Toggle week completion
  const toggleWeek = (week: WeekItem, milestoneId: string) => {
    const isDone = completedWeeks.includes(week.id);
    const weekTaskIds = week.tasks.map((_, idx) => `${week.id}-t${idx}`);

    if (isDone) {
      const updatedWeeks = completedWeeks.filter((id) => id !== week.id);
      const updatedTasks = completedTasks.filter((id) => !weekTaskIds.includes(id));
      setCompletedWeeks(updatedWeeks);
      setCompletedTasks(updatedTasks);
      setCompletedMilestones(completedMilestones.filter((id) => id !== milestoneId));
    } else {
      const updatedWeeks = Array.from(new Set([...completedWeeks, week.id]));
      const updatedTasks = Array.from(new Set([...completedTasks, ...weekTaskIds]));
      setCompletedWeeks(updatedWeeks);
      setCompletedTasks(updatedTasks);

      // Check if all weeks in milestone are now complete
      const parentMilestone = milestones.find((m) => m.id === milestoneId);
      if (parentMilestone) {
        const allWeeksDone = parentMilestone.weeklyContent.every((w) =>
          updatedWeeks.includes(w.id)
        );
        if (allWeeksDone && !completedMilestones.includes(milestoneId)) {
          setCompletedMilestones([...completedMilestones, milestoneId]);
        }
      }
    }
  };

  // Toggle milestone completion (and its weeks and tasks)
  const toggleMilestone = (milestone: RoadmapMilestone) => {
    const isDone = completedMilestones.includes(milestone.id);
    const weekIds = milestone.weeklyContent.map((w) => w.id);
    const allMilestoneTaskIds = milestone.weeklyContent.flatMap((w) =>
      w.tasks.map((_, idx) => `${w.id}-t${idx}`)
    );

    if (isDone) {
      setCompletedMilestones(completedMilestones.filter((id) => id !== milestone.id));
      setCompletedWeeks(completedWeeks.filter((id) => !weekIds.includes(id)));
      setCompletedTasks(completedTasks.filter((id) => !allMilestoneTaskIds.includes(id)));
    } else {
      const newMilestones = Array.from(new Set([...completedMilestones, milestone.id]));
      const newWeeks = Array.from(new Set([...completedWeeks, ...weekIds]));
      const newTasks = Array.from(new Set([...completedTasks, ...allMilestoneTaskIds]));
      setCompletedMilestones(newMilestones);
      setCompletedWeeks(newWeeks);
      setCompletedTasks(newTasks);
    }
  };

  // Toggle individual task within a week
  const toggleTask = (taskId: string, week: WeekItem, milestoneId: string) => {
    const isTaskDone = completedTasks.includes(taskId);
    const updatedTasks = isTaskDone
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId];
    setCompletedTasks(updatedTasks);

    const allWeekTaskIds = week.tasks.map((_, idx) => `${week.id}-t${idx}`);
    const areAllTasksDone = allWeekTaskIds.every((id) => updatedTasks.includes(id));

    let updatedWeeks = completedWeeks;
    if (areAllTasksDone && !completedWeeks.includes(week.id)) {
      updatedWeeks = [...completedWeeks, week.id];
      setCompletedWeeks(updatedWeeks);
    } else if (!areAllTasksDone && completedWeeks.includes(week.id)) {
      updatedWeeks = completedWeeks.filter((id) => id !== week.id);
      setCompletedWeeks(updatedWeeks);
      setCompletedMilestones(completedMilestones.filter((id) => id !== milestoneId));
    }

    if (areAllTasksDone) {
      const parentMilestone = milestones.find((m) => m.id === milestoneId);
      if (parentMilestone) {
        const allWeeksDone = parentMilestone.weeklyContent.every((w) =>
          updatedWeeks.includes(w.id)
        );
        if (allWeeksDone && !completedMilestones.includes(milestoneId)) {
          setCompletedMilestones([...completedMilestones, milestoneId]);
        }
      }
    }
  };

  const toggleMilestoneExpand = (milestoneId: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    milestones.forEach((m) => {
      next[m.id] = true;
    });
    setExpandedMilestones(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    milestones.forEach((m) => {
      next[m.id] = false;
    });
    setExpandedMilestones(next);
  };

  // Overall statistics
  const completedWeeksCount = allWeeks.filter((w) =>
    isWeekComplete(w.id, w.milestoneId)
  ).length;
  const weekPct =
    allWeeks.length > 0 ? Math.round((completedWeeksCount / allWeeks.length) * 100) : 0;
  const milestonesDoneCount = milestones.filter((m) =>
    completedMilestones.includes(m.id)
  ).length;

  // Filtered weeks
  const phases = useMemo(() => {
    return Array.from(new Set(milestones.map((m) => m.phase)));
  }, [milestones]);

  const filteredWeeks = useMemo(() => {
    return allWeeks.filter((w) => {
      if (selectedPhase !== "all" && w.phase !== selectedPhase) return false;
      const isDone = isWeekComplete(w.id, w.milestoneId);
      if (statusFilter === "pending" && isDone) return false;
      if (statusFilter === "completed" && !isDone) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = w.title.toLowerCase().includes(q);
        const matchesSummary = w.summary.toLowerCase().includes(q);
        const matchesTopics = w.topics.some((t) => t.toLowerCase().includes(q));
        const matchesHandsOn = w.handsOn.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesTopics && !matchesHandsOn) {
          return false;
        }
      }
      return true;
    });
  }, [allWeeks, selectedPhase, statusFilter, searchQuery, completedWeeks, completedMilestones]);

  const scrollToWeek = (weekNum: number) => {
    const parentMilestone = milestones.find((m) =>
      m.weeklyContent.some((w) => w.weekNumber === weekNum)
    );
    if (parentMilestone) {
      setExpandedMilestones((prev) => ({
        ...prev,
        [parentMilestone.id]: true,
      }));
    }
    if (statusFilter !== "all" || selectedPhase !== "all" || searchQuery) {
      setSelectedPhase("all");
      setStatusFilter("all");
      setSearchQuery("");
    }
    setTimeout(() => {
      const el = document.getElementById(`week-card-${weekNum}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary");
        }, 1800);
      }
    }, 100);
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your roadmap progress for this track?")) {
      setCompletedMilestones([]);
      setCompletedWeeks([]);
      setCompletedTasks([]);
    }
  };

  return (
    <div className="pb-24">
      {/* Page Header */}
      <PageHeader
        eyebrow={`${currentCareer.emoji} ${currentCareer.title} · ${currentCareer.stream || "Engineering"} Track · ${allWeeks.length} Weeks Curriculum`}
        title="Weekly Learning Roadmap"
        text={`Comprehensive week-by-week learning roadmap with step-by-step syllabus, hands-on portfolio deliverables, curated YouTube video lectures, and progress check-offs.`}
      />

      <div className="mx-auto max-w-5xl px-3 sm:px-4 space-y-6 sm:space-y-8">
        {/* Personalized Career Profile & Skills Readiness Banner */}
        {profile ? (
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Personalized for {profile.name}
                    </span>
                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {profile.education}
                    </span>
                    {topAssessedMatch?.career?.id === currentCareer.id && (
                      <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success flex items-center gap-1">
                        <Check className="h-3 w-3" /> #1 Assessment Match ({topAssessedMatch.score}%)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Target Role: <strong className="text-foreground">{currentCareer.emoji} {currentCareer.title}</strong> · Salary: {currentCareer.salary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition"
                >
                  <Compass className="h-3.5 w-3.5" /> Retake Assessment
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
                >
                  <Briefcase className="h-3.5 w-3.5" /> View Jobs
                </Link>
              </div>
            </div>

            {/* Assessment Alignment: Career Area, Skills & Interests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Selected Career Area */}
              <div className="rounded-2xl border bg-card/60 p-3.5 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" /> Career Area Chosen:
                </span>
                <p className="text-xs font-bold text-foreground">
                  {profile.interest || "Cross-Disciplinary"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Stream: {currentCareer.stream}
                </p>
              </div>

              {/* Skills Intelligence */}
              <div className="rounded-2xl border bg-card/60 p-3.5 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-accent" /> Skill Match & Roadmap Plan:
                  </span>
                  <span className="text-xs font-extrabold text-primary">
                    {skillAnalysis.percentage}% Match ({skillAnalysis.have.length}/{currentCareer.skills.length})
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {skillAnalysis.have.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-lg bg-success/15 border border-success/30 px-2 py-0.5 text-[11px] font-semibold text-success"
                      title="You already have this skill!"
                    >
                      <Check className="h-3 w-3" /> {s}
                    </span>
                  ))}
                  {skillAnalysis.toLearn.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary"
                      title="Roadmap will teach you this skill"
                    >
                      <Target className="h-3 w-3 opacity-70" /> {s}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  <span className="text-success font-semibold">Green:</span> Already in your skillset · <span className="text-primary font-semibold">Blue:</span> Taught step-by-step in this {allWeeks.length}-week curriculum.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Personalize this Roadmap for Your Degree & Skills
                </p>
                <p className="text-xs text-muted-foreground">
                  Take the 2-minute CareerAI Assessment to identify skill gaps and generate a customized path.
                </p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition shrink-0"
            >
              Take Assessment →
            </Link>
          </div>
        )}

        {/* Stream & Role Track Switcher */}
        <div className="rounded-3xl border bg-card/60 p-4 sm:p-5 backdrop-blur shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <h2 className="text-sm font-bold text-foreground">Explore Weekly Roadmaps by Role</h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {CAREERS.length} Roles Available
              </span>
            </div>

            {/* Mobile Native Dropdown for rapid jump */}
            <div className="sm:hidden w-full">
              <select
                value={activeTrack}
                onChange={(e) => setActiveTrack(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CAREERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.title} ({c.stream})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 -mx-1 px-1 touch-pan-x scrollbar-thin">
            {[
              { id: "All", label: `All Roles (${CAREERS.length})` },
              { id: "B.Tech / Engineering", label: `🎓 B.Tech (${CAREERS.filter((c) => c.stream === "B.Tech / Engineering").length})` },
              { id: "MCA / Applications", label: `💻 MCA (${CAREERS.filter((c) => c.stream === "MCA / Applications").length})` },
              { id: "MBA / Management", label: `📊 MBA (${CAREERS.filter((c) => c.stream === "MBA / Management").length})` },
              { id: "Cross-Disciplinary", label: `🎨 Cross-Disciplinary (${CAREERS.filter((c) => c.stream === "Cross-Disciplinary").length})` },
            ].map((stream) => (
              <button
                key={stream.id}
                onClick={() => setSelectedStream(stream.id)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedStream === stream.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {stream.label}
              </button>
            ))}
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {CAREERS.filter((c) => selectedStream === "All" || c.stream === selectedStream).map((career) => {
              const isActive = activeTrack === career.id;
              const isTop = topAssessedMatch?.career?.id === career.id;
              const weeksCount = (CAREER_ROADMAPS[career.id] || []).reduce(
                (sum, m) => sum + m.weeklyContent.length,
                0
              ) || 12;

              return (
                <button
                  key={career.id}
                  onClick={() => setActiveTrack(career.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10 ring-2 ring-primary shadow-sm"
                      : "border-border/70 bg-card hover:border-primary/50 hover:bg-secondary/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{career.emoji}</span>
                      {isTop && (
                        <span className="rounded-full bg-success/20 px-1.5 py-0.5 text-[9px] font-bold text-success">
                          Top Match
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-bold leading-snug line-clamp-2 ${isActive ? "text-primary" : "text-foreground"}`}>
                      {career.title}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-semibold">{weeksCount} Wks</span>
                    <span className="truncate max-w-[80px] opacity-80">{career.stream?.split(" ")[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Progress Overview Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-3.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Weeks
              </span>
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <p className="mt-1.5 sm:mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              {allWeeks.length} <span className="text-xs sm:text-sm font-normal text-muted-foreground">Wks</span>
            </p>
            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">Sequential curriculum</p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Hours
              </span>
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
            </div>
            <p className="mt-1.5 sm:mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              ~{totalHours} <span className="text-xs sm:text-sm font-normal text-muted-foreground">Hrs</span>
            </p>
            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">~8–12 hrs / week</p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Completed
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
            </div>
            <p className="mt-1.5 sm:mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              {completedWeeksCount} / {allWeeks.length}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">
              {allWeeks.length - completedWeeksCount} weeks left
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-3.5 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Milestones
              </span>
              <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <p className="mt-1.5 sm:mt-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              {milestonesDoneCount} / {milestones.length}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">Phases finished</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm">
          <div className="mb-2.5 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <span className="text-sm sm:text-base font-bold text-foreground">Roadmap Progress</span>
            </div>
            <span className="font-display text-base sm:text-lg font-extrabold text-primary">{weekPct}%</span>
          </div>
          <Bar value={weekPct} tone="success" />
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-muted-foreground">
            <span>
              {completedWeeksCount === 0
                ? "Start Week 1 today to build your streak!"
                : completedWeeksCount === allWeeks.length
                ? "🎉 Incredible! You completed the entire curriculum!"
                : `Great progress! ${completedWeeksCount} of ${allWeeks.length} weeks done.`}
            </span>
            {completedWeeksCount > 0 && (
              <button
                onClick={resetProgress}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive transition underline"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Week Scrubber / Navigator Ribbon */}
        <div className="rounded-2xl border bg-card p-3.5 sm:p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>Jump to Week:</span>
            </div>
            <span className="text-[11px] sm:text-xs text-muted-foreground">
              Tap any week
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin touch-pan-x -mx-1 px-1">
            {allWeeks.map((w) => {
              const done = isWeekComplete(w.id, w.milestoneId);
              return (
                <button
                  key={w.id}
                  onClick={() => scrollToWeek(w.weekNumber)}
                  title={`Week ${w.weekNumber}: ${w.title}`}
                  className={`flex h-8 sm:h-9 min-w-8 sm:min-w-9 items-center justify-center rounded-lg text-[11px] sm:text-xs font-bold transition px-2 ${
                    done
                      ? "bg-success text-primary-foreground shadow-sm"
                      : "border border-border bg-background hover:bg-secondary text-foreground"
                  }`}
                >
                  {done ? (
                    <span className="flex items-center gap-0.5">
                      <Check className="h-3 w-3" /> W{w.weekNumber}
                    </span>
                  ) : (
                    <span>W{w.weekNumber}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border bg-card/60 p-3 sm:p-4 backdrop-blur shadow-sm">
          {/* Phase Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 md:flex-wrap md:overflow-visible touch-pan-x">
            <button
              onClick={() => setSelectedPhase("all")}
              className={`shrink-0 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                selectedPhase === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              All Phases
            </button>
            {phases.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPhase(p)}
                className={`shrink-0 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                  selectedPhase === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-[140px] sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`rounded-md px-2 sm:px-2.5 py-1.5 font-medium transition ${
                  statusFilter === "all"
                    ? "bg-secondary font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`rounded-md px-2 sm:px-2.5 py-1.5 font-medium transition ${
                  statusFilter === "pending"
                    ? "bg-secondary font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`rounded-md px-2 sm:px-2.5 py-1.5 font-medium transition ${
                  statusFilter === "completed"
                    ? "bg-secondary font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Done
              </button>
            </div>

            <div className="flex items-center gap-1 border-l pl-2 sm:pl-3">
              <button
                onClick={expandAll}
                className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground underline"
              >
                Expand
              </button>
              <span className="text-muted-foreground text-xs">·</span>
              <button
                onClick={collapseAll}
                className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground underline"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>

        {/* Milestone & Week Content Stream */}
        <div className="space-y-10">
          {milestones.map((milestone) => {
            const milestoneWeeks = milestone.weeklyContent.filter((w) => {
              if (selectedPhase !== "all" && milestone.phase !== selectedPhase) return false;
              const isDone = isWeekComplete(w.id, milestone.id);
              if (statusFilter === "pending" && isDone) return false;
              if (statusFilter === "completed" && !isDone) return false;
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesTitle = w.title.toLowerCase().includes(q);
                const matchesSummary = w.summary.toLowerCase().includes(q);
                const matchesTopics = w.topics.some((t) => t.toLowerCase().includes(q));
                const matchesHandsOn = w.handsOn.toLowerCase().includes(q);
                if (!matchesTitle && !matchesSummary && !matchesTopics && !matchesHandsOn) {
                  return false;
                }
              }
              return true;
            });

            if (milestoneWeeks.length === 0) return null;

            const isMilestoneDone = completedMilestones.includes(milestone.id);
            const isExpanded = expandedMilestones[milestone.id] ?? true;

            const doneWeeksInMilestone = milestone.weeklyContent.filter((w) =>
              isWeekComplete(w.id, milestone.id)
            ).length;

            return (
              <section
                key={milestone.id}
                className="rounded-3xl border bg-card/40 backdrop-blur overflow-hidden shadow-sm transition"
              >
                {/* Milestone Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card/90 px-4 py-3.5 sm:px-6 sm:py-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => toggleMilestone(milestone)}
                      aria-label={`Mark milestone ${milestone.title} as ${isMilestoneDone ? "incomplete" : "complete"}`}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition ${
                        isMilestoneDone
                          ? "border-success bg-success text-primary-foreground shadow"
                          : "border-border bg-background hover:border-primary text-foreground"
                      }`}
                    >
                      {isMilestoneDone ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">
                          {doneWeeksInMilestone}/{milestone.weeklyContent.length}
                        </span>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] sm:text-xs font-bold text-primary">
                          {milestone.phase}
                        </span>
                        <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                          {milestone.weekRange} · {milestone.weeks} weeks
                        </span>
                      </div>
                      <h2
                        className={`text-base sm:text-xl font-bold text-foreground mt-0.5 ${
                          isMilestoneDone ? "line-through opacity-80" : ""
                        }`}
                      >
                        {milestone.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      {doneWeeksInMilestone} of {milestone.weeklyContent.length} weeks complete
                    </span>
                    <button
                      onClick={() => toggleMilestoneExpand(milestone.id)}
                      className="flex items-center gap-1 rounded-lg border bg-background px-2.5 sm:px-3 py-1.5 text-xs font-medium hover:bg-secondary transition"
                    >
                      <span>{isExpanded ? "Collapse" : "View"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Milestone Weekly Breakdown Content */}
                {isExpanded && (
                  <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
                    {milestoneWeeks.map((week) => {
                      const isDone = isWeekComplete(week.id, milestone.id);
                      return (
                        <article
                          key={week.id}
                          id={`week-card-${week.weekNumber}`}
                          className={`rounded-2xl border p-4 sm:p-6 transition-all duration-300 ${
                            isDone
                              ? "border-success/30 bg-success/5 opacity-85 shadow-none"
                              : "border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40"
                          }`}
                        >
                          {/* Week Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3.5 sm:pb-4">
                            <div className="flex items-start gap-2.5 sm:gap-3">
                              <span
                                className={`rounded-lg px-2 sm:px-2.5 py-1 font-display text-[11px] sm:text-xs font-bold tracking-wide uppercase shrink-0 ${
                                  isDone
                                    ? "bg-success text-primary-foreground"
                                    : "bg-primary text-primary-foreground"
                                }`}
                              >
                                W{week.weekNumber}
                              </span>
                              <div>
                                <h3
                                  className={`text-base sm:text-lg font-bold text-foreground leading-snug ${
                                    isDone ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {week.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                                  {milestone.phase} · {milestone.title}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 self-stretch sm:self-center pt-1 sm:pt-0">
                              <span className="flex items-center gap-1 rounded-md bg-secondary/80 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-secondary-foreground">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                                {week.estimatedHours}h effort
                              </span>
                              <button
                                onClick={() => toggleWeek(week, milestone.id)}
                                aria-label={`Mark Week ${week.weekNumber} complete`}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                  isDone
                                    ? "border-success bg-success text-primary-foreground shadow"
                                    : "border-border bg-background hover:bg-secondary text-foreground"
                                }`}
                              >
                                {isDone ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" /> Done
                                  </>
                                ) : (
                                  <>
                                    <Square className="h-3.5 w-3.5" /> Mark Done
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Week Summary */}
                          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            {week.summary}
                          </p>

                          {/* Core Topics Covered */}
                          <div className="mt-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                              <Code className="h-3.5 w-3.5 text-primary" /> Core Topics Covered:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {week.topics.map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-md border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-secondary"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Curated YouTube Video Tutorial */}
                          {week.youtubeUrl && (
                            <div className="mt-4 rounded-xl border border-red-500/25 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-3.5 sm:p-4 transition hover:border-red-500/40">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
                                    <Youtube className="h-5 w-5" />
                                  </span>
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                                        Curated Video Lecture
                                      </span>
                                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                                        YouTube
                                      </span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {week.youtubeTitle || "Recommended Video Tutorial"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() =>
                                      setPlayingVideoWeek(
                                        playingVideoWeek === week.id ? null : week.id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition"
                                  >
                                    {playingVideoWeek === week.id ? (
                                      <>
                                        <X className="h-3.5 w-3.5 text-red-600" /> Close Video
                                      </>
                                    ) : (
                                      <>
                                        <Play className="h-3.5 w-3.5 text-red-600 fill-current" /> Preview
                                      </>
                                    )}
                                  </button>
                                  <a
                                    href={week.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 transition"
                                  >
                                    <Youtube className="h-3.5 w-3.5" />
                                    Watch on YouTube
                                    <ExternalLink className="h-3 w-3 opacity-80" />
                                  </a>
                                </div>
                              </div>

                              {/* Embedded YouTube Player */}
                              {playingVideoWeek === week.id && (
                                <div className="relative mt-3.5 aspect-video w-full overflow-hidden rounded-xl border border-red-500/20 bg-black shadow-lg animate-in fade-in zoom-in-95 duration-200">
                                  <iframe
                                    src={getYouTubeEmbedUrl(week.youtubeUrl)!}
                                    title={week.youtubeTitle || `Week ${week.weekNumber} Video Lecture`}
                                    className="h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Hands-On Project & Deliverable */}
                          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <div className="flex items-start gap-3">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <Briefcase className="h-4 w-4" />
                              </span>
                              <div className="flex-1 space-y-1.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                  Weekly Hands-On Practical Project
                                </p>
                                <p className="text-sm font-semibold text-foreground">
                                  {week.handsOn}
                                </p>
                                {week.deliverable && (
                                  <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                                    <span className="font-bold text-foreground">Portfolio Deliverable:</span>
                                    <span>{week.deliverable}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Interactive Weekly Action Tasks Checklist */}
                          <div className="mt-5 rounded-xl border bg-background/60 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                <CheckSquare className="h-3.5 w-3.5 text-primary" />
                                Actionable Weekly Checklist:
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {
                                  week.tasks.filter((_, idx) =>
                                    completedTasks.includes(`${week.id}-t${idx}`)
                                  ).length
                                }{" "}
                                / {week.tasks.length} tasks done
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {week.tasks.map((task, idx) => {
                                const taskId = `${week.id}-t${idx}`;
                                const isTaskDone = completedTasks.includes(taskId);
                                return (
                                  <li key={taskId} className="flex items-start gap-2.5 text-xs">
                                    <button
                                      onClick={() => toggleTask(taskId, week, milestone.id)}
                                      className="mt-0.5 text-muted-foreground hover:text-foreground transition"
                                    >
                                      {isTaskDone ? (
                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                      ) : (
                                        <Square className="h-4 w-4" />
                                      )}
                                    </button>
                                    <span
                                      className={`flex-1 ${
                                        isTaskDone
                                          ? "line-through text-muted-foreground"
                                          : "text-foreground"
                                      }`}
                                    >
                                      {task}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {/* Curated Resources */}
                          {week.resources && week.resources.length > 0 && (
                            <div className="mt-5 border-t border-border/50 pt-3">
                              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5 text-accent" /> Recommended Study Material & Practice:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {week.resources.map((res) => {
                                  const isVideo = res.type === "video";
                                  const targetUrl =
                                    res.url ||
                                    (isVideo && week.youtubeUrl) ||
                                    `https://www.youtube.com/results?search_query=${encodeURIComponent(res.name)}`;
                                  return (
                                    <a
                                      key={res.name}
                                      href={targetUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                        isVideo
                                          ? "border-red-500/30 bg-red-500/5 text-foreground hover:bg-red-500/10 hover:border-red-500/50"
                                          : "border-border bg-background text-foreground hover:bg-secondary/70"
                                      }`}
                                    >
                                      {isVideo ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                                          <Youtube className="h-3 w-3 fill-red-500/20" />
                                          [video]
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                          [{res.type}]
                                        </span>
                                      )}
                                      <span>{res.name}</span>
                                      <ExternalLink className="h-3 w-3 text-muted-foreground/80 hover:text-primary transition" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Resume Option: Upload from Local Laptop after completion of weekly content before ready for job */}
        <section
          id="resume-upload-section"
          className={`rounded-3xl border transition-all duration-300 p-6 sm:p-8 backdrop-blur shadow-sm ${
            isAllWeeksCompleted
              ? "border-primary/40 bg-gradient-to-b from-primary/5 via-card/80 to-card shadow-md"
              : "border-border/80 bg-card/60"
          }`}
        >
          {/* Hidden File Input for Local File Selection */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border/60 pb-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {isAllWeeksCompleted ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 100% Roadmap Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                    <Clock className="h-3.5 w-3.5" /> {allWeeks.filter((w) => isWeekComplete(w.id, w.milestoneId)).length} of {allWeeks.length} Weeks Done
                  </span>
                )}
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Job Preparation
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                Attach Resume from Local Device
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                After working through your weekly syllabus and hands-on projects, attach your updated resume directly from your laptop. CareerAI links this resume to your profile so hiring companies see your portfolio-backed qualifications.
              </p>
            </div>

            {/* Quick completion badge */}
            <div className="shrink-0">
              {resume ? (
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <FileCheck className="h-4 w-4" /> Resume Linked
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition"
                >
                  <Upload className="h-4 w-4" /> Upload Resume
                </button>
              )}
            </div>
          </div>

          {/* Curriculum Completion Milestone Notice */}
          <div className="mt-5">
            {isAllWeeksCompleted ? (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-5 w-5 shrink-0 text-emerald-500" />
                <p>
                  <strong>Congratulations on completing all weekly contents!</strong> Your comprehensive skills and deliverables are validated. Upload your latest resume to complete your candidate file before applying to matching positions.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-secondary/60 border border-border/70 p-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    Current progress: <strong>{allWeeks.filter((w) => isWeekComplete(w.id, w.milestoneId)).length} / {allWeeks.length} weeks finished</strong>.
                  </span>
                </div>
                <span>You can upload your resume now or after completing remaining project deliverables.</span>
              </div>
            )}
          </div>

          {/* Upload Dropzone / Verified File Card */}
          <div className="mt-5">
            {!resume ? (
              /* Drag & Drop Area */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/10 ring-4 ring-primary/20 scale-[1.01]"
                    : "border-border/80 hover:border-primary/60 bg-background/50 hover:bg-secondary/40"
                }`}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-foreground">
                  Drag and drop your resume file here
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
                  Or click to browse and select a file directly from your local laptop
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-md border bg-card px-2 py-0.5 font-medium">📄 PDF</span>
                  <span className="rounded-md border bg-card px-2 py-0.5 font-medium">📝 DOC / DOCX</span>
                  <span className="rounded-md border bg-card px-2 py-0.5 font-medium">📋 TXT</span>
                  <span>· Maximum size: 10MB</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition"
                >
                  <FileText className="h-4 w-4" /> Choose File from Laptop
                </button>
              </div>
            ) : (
              /* Uploaded Resume File Card */
              <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 sm:p-6 transition shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Ready for Hiring
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {resume.size} · Uploaded on {resume.uploadedAt}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground mt-1 truncate max-w-sm sm:max-w-md">
                        {resume.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Uploaded from your local laptop and saved to your CareerAI profile.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:self-center">
                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                      title="Download or preview resume"
                    >
                      <Download className="h-3.5 w-3.5 text-primary" />
                      <span>Download / View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                      title="Replace with another file from laptop"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-background px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition"
                      title="Delete uploaded resume"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Skills verification tag banner */}
                <div className="mt-4 pt-3.5 border-t border-emerald-500/20 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Matched Roadmap Credentials:</span>
                  {(activeTrack === "data-analyst"
                    ? ["Excel & Pivot", "SQL Relational", "Python & Pandas", "Power BI Dashboards", "Statistical A/B Testing", "Capstone Repository"]
                    : ["HTML5 & CSS Grid", "JavaScript ES6+", "TypeScript", "React 19 & Hooks", "TanStack Router", "Tailwind CSS", "Full-Stack SaaS"]
                  ).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      <Check className="h-3 w-3 text-emerald-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Milestone Graduation Card: Ready for Job */}
        <div className="rounded-3xl border bg-hero p-8 text-hero-foreground text-center relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold text-accent">
              <Award className="h-4 w-4" /> Next Milestone
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-hero-foreground">
              Ready to Validate Your Skills with Real Jobs?
            </h3>
            <p className="text-sm opacity-85 max-w-xl mx-auto">
              As you progress through your weekly curriculum and build your resume, review active openings matched to your
              skills on our Job Board or retake the assessment to see your updated career readiness.
            </p>

            {/* Resume status notification inside job readiness card */}
            {resume && (
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/40 px-4 py-1.5 text-xs font-bold text-accent">
                <FileCheck className="h-4 w-4" /> Resume Attached: {resume.name} (Ready to Apply)
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition shadow"
              >
                {resume ? "Apply to Jobs with Your Resume" : "Explore Matched Jobs"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-hero-foreground/30 bg-hero-foreground/10 px-5 py-2.5 text-sm font-semibold text-hero-foreground hover:bg-hero-foreground/20 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

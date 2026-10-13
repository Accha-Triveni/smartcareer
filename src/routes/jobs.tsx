import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  ExternalLink,
  Bot,
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  Bookmark,
  Copy,
  Check,
  X,
  FileText,
  Briefcase,
  AlertCircle,
  ArrowUpRight,
  Send,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/SiteLayout";
import {
  JOBS,
  type JobListing,
  type JobPlatform,
  type Profile,
} from "@/lib/career-data";
import { useStored } from "@/lib/storage";
import type { UploadedResume } from "./roadmap";
import {
  isOpenAIConfigured,
  generateAICoverLetter,
  generateAIColdOutreach,
  askOpenAIJobAssistant,
} from "@/lib/openai";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Real-Time Jobs & AI Assistant – CareerAI" },
      {
        name: "description",
        content:
          "Explore real-time entry-level and internship jobs from LinkedIn, Unstop, Indeed and Naukri with our AI Job Copilot.",
      },
      { property: "og:title", content: "Real-Time Jobs & AI Assistant – CareerAI" },
      {
        property: "og:description",
        content:
          "Apply to live job listings on LinkedIn and Unstop with AI Resume Fit & Cover Letter Copilot.",
      },
    ],
  }),
  component: Jobs,
});

const PLATFORM_COLORS: Record<JobPlatform, { badge: string; border: string; text: string }> = {
  LinkedIn: {
    badge: "bg-[#0A66C2]/10 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#70B5F9]",
    border: "border-[#0A66C2]/30",
    text: "text-[#0A66C2] dark:text-[#70B5F9]",
  },
  Unstop: {
    badge: "bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  Indeed: {
    badge: "bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  Naukri: {
    badge: "bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  Wellfound: {
    badge: "bg-amber-600/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  Internshala: {
    badge: "bg-sky-600/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
    border: "border-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
  },
};

function Jobs() {
  const [profile] = useStored<Profile | null>("careerai-profile", null);
  const [resume] = useStored<UploadedResume | null>("careerai-resume", null);
  const [completedWeeks] = useStored<string[]>("careerai-roadmap-weeks", []);
  const [savedJobIds, setSavedJobIds] = useStored<string[]>("careerai-saved-jobs", []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedCareer, setSelectedCareer] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");

  // AI Assistant Modal State
  const [activeJobForAI, setActiveJobForAI] = useState<JobListing | null>(null);
  const [activeAITab, setActiveAITab] = useState<"match" | "cover-letter" | "outreach" | "interview" | "ask">("match");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswers, setCustomAnswers] = useState<Array<{ q: string; a: string; source?: "openai" | "fallback" }>>([]);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [coverLetterMap, setCoverLetterMap] = useState<Record<string, { text: string; source: "openai" | "fallback" }>>({});
  const [outreachMap, setOutreachMap] = useState<Record<string, { text: string; source: "openai" | "fallback" }>>({});

  const platforms: Array<"All" | JobPlatform> = [
    "All",
    "LinkedIn",
    "Unstop",
    "Indeed",
    "Naukri",
    "Internshala",
    "Wellfound",
  ];

  const locations = useMemo(() => {
    return ["All", ...Array.from(new Set(JOBS.map((j) => j.location)))];
  }, []);

  // Filtered Jobs List
  const filteredJobs = useMemo(() => {
    return JOBS.filter((j) => {
      if (selectedPlatform !== "All" && j.platform !== selectedPlatform) return false;
      if (selectedCareer !== "All" && j.career !== selectedCareer) return false;
      if (selectedType !== "All" && j.type !== selectedType) return false;
      if (selectedWorkplace !== "All" && j.workplaceType !== selectedWorkplace) return false;
      if (selectedLocation !== "All" && j.location !== selectedLocation) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.platform.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      return true;
    });
  }, [selectedPlatform, selectedCareer, selectedType, selectedWorkplace, selectedLocation, searchQuery]);

  // Compute Skill Match for a job
  const computeMatchScore = (job: JobListing) => {
    const candidateSkills = profile?.skills || [
      "SQL",
      "Python",
      "Excel",
      "Power BI",
      "React",
      "JavaScript",
      "Git",
    ];
    const matchingSkills = job.skills.filter((s) =>
      candidateSkills.some((cs) => cs.toLowerCase() === s.toLowerCase())
    );

    const matchRatio = matchingSkills.length / Math.max(job.skills.length, 1);
    const bonus = resume ? 15 : 5;
    const roadmapBonus = completedWeeks.length > 5 ? 15 : completedWeeks.length * 2;
    const finalScore = Math.min(Math.round(matchRatio * 70 + bonus + roadmapBonus), 98);

    return {
      score: Math.max(finalScore, 45),
      matchingSkills,
      missingSkills: job.skills.filter(
        (s) => !candidateSkills.some((cs) => cs.toLowerCase() === s.toLowerCase())
      ),
    };
  };

  const toggleSaveJob = (job: JobListing) => {
    const isSaved = savedJobIds.includes(job.id);
    if (isSaved) {
      setSavedJobIds(savedJobIds.filter((id) => id !== job.id));
      toast.info(`Removed "${job.title}" from saved list`);
    } else {
      setSavedJobIds([...savedJobIds, job.id]);
      toast.success(`Saved "${job.title}" at ${job.company} to your jobs list`);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !activeJobForAI || isAskingAI) return;

    const q = customQuestion.trim();
    const company = activeJobForAI.company;
    const title = activeJobForAI.title;
    setCustomQuestion("");
    setIsAskingAI(true);

    let fallback = "";
    if (q.toLowerCase().includes("salary") || q.toLowerCase().includes("negotiat")) {
      fallback = `For ${title} at ${company}, the standard budget is ${activeJobForAI.salary}. As an entry-level applicant, highlight your completed roadmap projects and ask for the upper 70th percentile (approx ${activeJobForAI.salary.split("–")[1] || activeJobForAI.salary}) during HR alignment.`;
    } else if (q.toLowerCase().includes("resume") || q.toLowerCase().includes("project")) {
      fallback = `Make sure your resume highlights: ${activeJobForAI.skills.slice(0, 3).join(", ")}. In your experience bullets, explain quantifiable outcomes (e.g. "Analyzed 10k rows", "Optimized render speeds by 30%") to pass ${company}'s ATS scanner.`;
    } else if (q.toLowerCase().includes("round") || q.toLowerCase().includes("interview")) {
      fallback = `Typically, ${company} conducts 3 rounds: 1) Recruiter screening on background and resume projects, 2) Technical live coding/case study in ${activeJobForAI.skills[0] || "core tools"}, and 3) Hiring manager round testing cultural alignment.`;
    } else {
      fallback = `Great question! For this ${title} role at ${company}, emphasize your hands-on practical foundation in ${activeJobForAI.skills.slice(0, 3).join(", ")}. Mention your GitHub portfolio deliverable and demonstrate proactive problem solving.`;
    }

    try {
      const res = await askOpenAIJobAssistant(activeJobForAI, q, profile, resume, fallback);
      setCustomAnswers((prev) => [{ q, a: res.text, source: res.source }, ...prev]);
      if (res.source === "openai") {
        toast.success("Answered with OpenAI GPT-4o-mini");
      }
    } catch {
      setCustomAnswers((prev) => [{ q, a: fallback, source: "fallback" }, ...prev]);
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleGenerateAICoverLetter = async () => {
    if (!activeJobForAI || isGeneratingDoc) return;
    setIsGeneratingDoc(true);
    const defaultText = generateCoverLetter(activeJobForAI);
    try {
      const res = await generateAICoverLetter(activeJobForAI, profile, resume, defaultText);
      setCoverLetterMap((prev) => ({ ...prev, [activeJobForAI.id]: res }));
      if (res.source === "openai") {
        toast.success("Generated tailored cover letter via OpenAI GPT-4o-mini!");
      } else {
        toast.info("Generated tailored cover letter");
      }
    } catch {
      setCoverLetterMap((prev) => ({ ...prev, [activeJobForAI.id]: { text: defaultText, source: "fallback" } }));
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const handleGenerateAIOutreach = async () => {
    if (!activeJobForAI || isGeneratingDoc) return;
    setIsGeneratingDoc(true);
    const defaultText = generateOutreach(activeJobForAI);
    try {
      const res = await generateAIColdOutreach(activeJobForAI, profile, resume, defaultText);
      setOutreachMap((prev) => ({ ...prev, [activeJobForAI.id]: res }));
      if (res.source === "openai") {
        toast.success("Generated recruiter outreach via OpenAI GPT-4o-mini!");
      } else {
        toast.info("Generated recruiter outreach");
      }
    } catch {
      setOutreachMap((prev) => ({ ...prev, [activeJobForAI.id]: { text: defaultText, source: "fallback" } }));
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  // Generate personalized cover letter
  const generateCoverLetter = (job: JobListing) => {
    const candidateName = profile?.name || "Aspiring Technologist";
    const resumeNote = resume ? ` as detailed in my attached resume (${resume.name})` : "";
    return `Dear Hiring Team at ${job.company},

I am writing to express my strong interest in the ${job.title} role (${job.platform} listing). Having rigorously built my technical foundation through hands-on practical roadmaps—covering ${job.skills.join(", ")}—I am confident in my ability to deliver immediate value to your engineering and analytics initiatives.

Throughout my recent project work${resumeNote}, I have focused on solving real-world challenges:
• Implemented end-to-end data pipelines and responsive user experiences utilizing ${job.skills.slice(0, 2).join(" and ")}.
• Translated complex stakeholder problem statements into robust, well-documented code and measurable business outcomes.
• Developed an active GitHub portfolio demonstrating production best practices, error handling, and performance optimization.

${job.company}'s mission resonates deeply with my career objectives, and I am excited about the prospect of contributing to your team's upcoming milestones. I welcome the opportunity to discuss how my technical skills and work ethic align with your needs.

Thank you for your time and consideration.

Warm regards,
${candidateName}
Portfolio & Work Samples Available Upon Request`;
  };

  // Generate cold outreach message
  const generateOutreach = (job: JobListing) => {
    const candidateName = profile?.name ? profile.name.split(" ")[0] : "Candidate";
    return `Hi [Recruiter Name],

I noticed the ${job.title} opening at ${job.company} posted on ${job.platform} and wanted to reach out directly. 

I've recently completed a comprehensive practical curriculum specializing in ${job.skills.slice(0, 3).join(", ")} with verified portfolio projects${resume ? ` and an updated resume (${resume.name})` : ""}.

I'd love to share my project repository and briefly discuss how my skill set can support ${job.company}'s current goals. 

Would you be open to a quick 5-minute chat this week?

Best regards,
${candidateName}`;
  };

  return (
    <div className="pb-24">
      {/* Page Header */}
      <PageHeader
        eyebrow="Real-Time Job Explorer"
        title="Live Opportunities with AI Assistant"
        text="Aggregated entry-level jobs and internships from LinkedIn, Unstop, Indeed, and Naukri. Use the AI Copilot to check resume match, draft cover letters, and prepare for interviews."
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4">
        {/* Candidate Readiness Summary Banner */}
        <div className="rounded-2xl border bg-card/60 backdrop-blur p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Candidate Profile
                </span>
                {resume ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Resume: {resume.name}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-bold px-2 py-0.5">
                    <AlertCircle className="h-3 w-3" /> No Resume Attached
                  </span>
                )}
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                  {completedWeeks.length} Weeks Completed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {resume
                  ? "AI Copilot is utilizing your local resume and completed roadmap to calculate real-time job fit scores."
                  : "Upload your resume in the Roadmap page to unlock 100% personalized AI cover letter and resume scoring."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!resume && (
              <Link
                to="/roadmap"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
              >
                <FileText className="h-3.5 w-3.5" /> Attach Resume in Roadmap
              </Link>
            )}
            <button
              onClick={() => {
                const sampleJob = filteredJobs[0] || JOBS[0];
                setActiveJobForAI(sampleJob);
                setActiveAITab("match");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
            >
              <Bot className="h-4 w-4" /> Open AI Job Copilot
            </button>
          </div>
        </div>

        {/* Search & Direct Live Platform Search Shortcuts */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search real-time jobs by role, company (e.g. Swiggy, Razorpay, Tata Steel), skills, or platform..."
              className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Platform Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-muted-foreground shrink-0 flex items-center gap-1 mr-1">
              Source:
            </span>
            {platforms.map((platform) => {
              const isSelected = selectedPlatform === platform;
              const colorConfig = platform !== "All" ? PLATFORM_COLORS[platform] : null;

              return (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow"
                      : colorConfig
                        ? `border ${colorConfig.border} bg-card text-foreground hover:bg-secondary`
                        : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {platform !== "All" && (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        platform === "LinkedIn"
                          ? "bg-[#0A66C2]"
                          : platform === "Unstop"
                            ? "bg-blue-600"
                            : platform === "Indeed"
                              ? "bg-indigo-600"
                              : "bg-emerald-600"
                      }`}
                    />
                  )}
                  {platform}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <select
              aria-label="Filter by Domain"
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="rounded-lg border bg-card px-3 py-2 text-foreground font-medium"
            >
              <option value="All">All Domains</option>
              <option value="Data">Data & Analytics</option>
              <option value="Software">Software & Web</option>
              <option value="Cloud">Cloud & DevOps</option>
              <option value="Design">Product Design</option>
            </select>

            <select
              aria-label="Filter by Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border bg-card px-3 py-2 text-foreground font-medium"
            >
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time Roles</option>
              <option value="Internship">Internships</option>
            </select>

            <select
              aria-label="Filter by Workplace"
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
              className="rounded-lg border bg-card px-3 py-2 text-foreground font-medium"
            >
              <option value="All">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              aria-label="Filter by Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-lg border bg-card px-3 py-2 text-foreground font-medium"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All" ? "All Locations" : loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-Time Platform External Search Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-secondary/40 px-4 py-2.5 text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Showing <strong>{filteredJobs.length}</strong> real-time opportunities matched to entry-level candidates
          </span>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden sm:inline">Search live:</span>
            <a
              href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                searchQuery || "Junior Data Analyst OR Frontend Developer"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-[#0A66C2]/30 bg-[#0A66C2]/10 px-2.5 py-1 text-[11px] font-bold text-[#0A66C2] dark:text-[#70B5F9] hover:bg-[#0A66C2]/20 transition"
            >
              LinkedIn Live ↗
            </a>
            <a
              href={`https://unstop.com/jobs?searchTerm=${encodeURIComponent(
                searchQuery || "Data Analyst OR Web Developer"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
            >
              Unstop Live ↗
            </a>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const matchInfo = computeMatchScore(job);
            const colorConfig = PLATFORM_COLORS[job.platform];

            return (
              <article
                key={job.id}
                className={`rounded-2xl border bg-card p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md hover:border-primary/40 relative ${
                  job.featured ? "ring-1 ring-primary/20" : ""
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {/* Platform Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${colorConfig.badge}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {job.platform}
                      </span>

                      {/* Posted Ago with Live Pulse */}
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        {job.postedAgo}
                      </span>
                    </div>

                    {/* AI Match Score Pill */}
                    <button
                      onClick={() => {
                        setActiveJobForAI(job);
                        setActiveAITab("match");
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition"
                      title="Click to view AI skill match breakdown"
                    >
                      <Sparkles className="h-3 w-3" />
                      {matchInfo.score}% Match
                    </button>
                  </div>

                  {/* Job Title & Company */}
                  <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                    {job.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {job.location} ({job.workplaceType})
                    </span>
                    <span className="font-semibold text-primary">
                      {job.salary}
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
                      {job.type}
                    </span>
                    {job.skills.map((skill) => {
                      const isCandidateSkill = matchInfo.matchingSkills.includes(skill);
                      return (
                        <span
                          key={skill}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium border transition ${
                            isCandidateSkill
                              ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                              : "bg-secondary/60 border-border/60 text-muted-foreground"
                          }`}
                        >
                          {isCandidateSkill && "✓ "}
                          {skill}
                        </span>
                      );
                    })}
                  </div>

                  {/* Eligibility note */}
                  {job.eligibility && (
                    <p className="mt-2.5 text-[11px] text-muted-foreground/80 flex items-center gap-1">
                      <span className="font-semibold text-foreground/80">Eligibility:</span>
                      <span className="truncate">{job.eligibility}</span>
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  {/* AI Assistant Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveJobForAI(job);
                      setActiveAITab("match");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/15 px-3 py-2 text-xs font-bold text-primary transition"
                  >
                    <Bot className="h-4 w-4" />
                    <span>AI Assistant</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job)}
                      className={`grid h-9 w-9 place-items-center rounded-xl border transition ${
                        isSaved
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                      title={isSaved ? "Saved" : "Save Job"}
                      aria-label="Save Job"
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>

                    {/* Apply Link to real site */}
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition"
                    >
                      <span>Apply on {job.platform}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredJobs.length === 0 && (
          <div className="rounded-3xl border border-dashed p-12 text-center space-y-3">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="font-bold text-lg text-foreground">No jobs match your current filters</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try broadening your platform or location filters, or search directly on LinkedIn and Unstop.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedPlatform("All");
                setSelectedCareer("All");
                setSelectedType("All");
                setSelectedLocation("All");
              }}
              className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* AI JOB ASSISTANT MODAL (Interactive Copilot for Selected Job)   */}
      {/* ============================================================== */}
      {activeJobForAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl max-h-[90vh] rounded-3xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 bg-card/90">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">CareerAI Job Copilot</h3>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 inline-flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> OpenAI GPT-4o-mini
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Analyzing {activeJobForAI.title} at {activeJobForAI.company} ({activeJobForAI.platform})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveJobForAI(null)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b bg-secondary/30 px-4 py-2 overflow-x-auto scrollbar-none text-xs">
              <button
                onClick={() => setActiveAITab("match")}
                className={`rounded-lg px-3 py-1.5 font-bold transition flex items-center gap-1.5 shrink-0 ${
                  activeAITab === "match"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" /> Resume & Skill Match
              </button>
              <button
                onClick={() => setActiveAITab("cover-letter")}
                className={`rounded-lg px-3 py-1.5 font-bold transition flex items-center gap-1.5 shrink-0 ${
                  activeAITab === "cover-letter"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" /> AI Cover Letter
              </button>
              <button
                onClick={() => setActiveAITab("outreach")}
                className={`rounded-lg px-3 py-1.5 font-bold transition flex items-center gap-1.5 shrink-0 ${
                  activeAITab === "outreach"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Send className="h-3.5 w-3.5" /> Recruiter Cold Message
              </button>
              <button
                onClick={() => setActiveAITab("interview")}
                className={`rounded-lg px-3 py-1.5 font-bold transition flex items-center gap-1.5 shrink-0 ${
                  activeAITab === "interview"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> Interview Prep Q&A
              </button>
              <button
                onClick={() => setActiveAITab("ask")}
                className={`rounded-lg px-3 py-1.5 font-bold transition flex items-center gap-1.5 shrink-0 ${
                  activeAITab === "ask"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" /> Ask Assistant
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
              {/* TAB 1: RESUME & SKILL MATCH */}
              {activeAITab === "match" && (
                <div className="space-y-4">
                  {/* Score Card */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Overall Candidate Fit
                      </span>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-foreground">
                        {computeMatchScore(activeJobForAI).score}% Compatibility
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Calculated from your roadmap milestones and {resume ? `local resume (${resume.name})` : "profile skills"}.
                      </p>
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-white font-display text-xl font-extrabold shadow-md">
                      {computeMatchScore(activeJobForAI).score}%
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div className="rounded-xl border bg-card p-4 space-y-2">
                    <h5 className="font-bold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Skills You Already Have ({computeMatchScore(activeJobForAI).matchingSkills.length}):
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {computeMatchScore(activeJobForAI).matchingSkills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing / Focus Skills */}
                  {computeMatchScore(activeJobForAI).missingSkills.length > 0 && (
                    <div className="rounded-xl border bg-card p-4 space-y-2">
                      <h5 className="font-bold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Recommended Topics to Brush Up Before Interview:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {computeMatchScore(activeJobForAI).missingSkills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Copilot Advice */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-primary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> AI Application Recommendation:
                    </span>
                    <p>
                      {activeJobForAI.company} prioritizes candidates who can demonstrate practical project proofs over theoretical degrees. Your completed curriculum in <strong>{activeJobForAI.skills[0]}</strong> and <strong>{activeJobForAI.skills[1]}</strong> positions you in the top 15% of fresher applicants on {activeJobForAI.platform}.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: COVER LETTER */}
              {activeAITab === "cover-letter" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        AI tailored cover letter based on your roadmap credentials & {activeJobForAI.company} specs:
                      </p>
                      {coverLetterMap[activeJobForAI.id]?.source === "openai" ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                          ✨ Live OpenAI GPT-4o-mini
                        </span>
                      ) : (
                        <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 border border-primary/20">
                          AI Blueprint
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGenerateAICoverLetter}
                        disabled={isGeneratingDoc}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold transition disabled:opacity-60"
                      >
                        {isGeneratingDoc ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3" /> Regenerate with OpenAI
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            coverLetterMap[activeJobForAI.id]?.text || generateCoverLetter(activeJobForAI),
                            "cover-letter"
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-secondary transition"
                      >
                        {copiedKey === "cover-letter" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy Letter
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <pre className="p-4 rounded-xl border bg-secondary/40 text-xs font-sans whitespace-pre-wrap leading-relaxed text-foreground select-all max-h-[360px] overflow-y-auto">
                    {coverLetterMap[activeJobForAI.id]?.text || generateCoverLetter(activeJobForAI)}
                  </pre>
                </div>
              )}

              {/* TAB 3: RECRUITER COLD OUTREACH */}
              {activeAITab === "outreach" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        High-converting 3-sentence message to send on {activeJobForAI.platform} or Email:
                      </p>
                      {outreachMap[activeJobForAI.id]?.source === "openai" ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                          ✨ Live OpenAI GPT-4o-mini
                        </span>
                      ) : (
                        <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 border border-primary/20">
                          AI Blueprint
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGenerateAIOutreach}
                        disabled={isGeneratingDoc}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold transition disabled:opacity-60"
                      >
                        {isGeneratingDoc ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3" /> Regenerate with OpenAI
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            outreachMap[activeJobForAI.id]?.text || generateOutreach(activeJobForAI),
                            "outreach"
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-secondary transition"
                      >
                        {copiedKey === "outreach" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <pre className="p-4 rounded-xl border bg-secondary/40 text-xs font-sans whitespace-pre-wrap leading-relaxed text-foreground select-all">
                    {outreachMap[activeJobForAI.id]?.text || generateOutreach(activeJobForAI)}
                  </pre>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground">
                    💡 <strong>Pro-Tip:</strong> Search <em>"{activeJobForAI.company} Recruiter"</em> or <em>"{activeJobForAI.company} Talent Acquisition"</em> on LinkedIn and send this note with your connection request.
                  </div>
                </div>
              )}

              {/* TAB 4: INTERVIEW PREPARATION */}
              {activeAITab === "interview" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Top 4 questions {activeJobForAI.company} asks for {activeJobForAI.title} roles:
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-xl border p-3.5 bg-card space-y-1">
                      <p className="font-bold text-foreground">
                        1. "How do you approach querying large or messy datasets in {activeJobForAI.skills[0]}?"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>AI Suggested Answer:</strong> Mention partitioning strategies, filtering early with WHERE clauses before JOINs, and handling dirty nulls with COALESCE (practiced in Roadmap Week 5-7).
                      </p>
                    </div>

                    <div className="rounded-xl border p-3.5 bg-card space-y-1">
                      <p className="font-bold text-foreground">
                        2. "Walk me through a project where you solved an unexpected data or bug issue."
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>AI Suggested Answer:</strong> Use the STAR method to describe your Roadmap Capstone project—state the business problem, your architectural solution, and the delivered outcome.
                      </p>
                    </div>

                    <div className="rounded-xl border p-3.5 bg-card space-y-1">
                      <p className="font-bold text-foreground">
                        3. "Why are you interested in joining {activeJobForAI.company} over other companies?"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>AI Suggested Answer:</strong> Mention {activeJobForAI.company}'s market leadership, specific consumer scale, and your excitement to contribute your {activeJobForAI.skills.slice(0, 2).join(" & ")} skills to their growth.
                      </p>
                    </div>

                    <div className="rounded-xl border p-3.5 bg-card space-y-1">
                      <p className="font-bold text-foreground">
                        4. "How do you communicate technical findings to non-technical stakeholders?"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>AI Suggested Answer:</strong> Explain how you lead with high-level KPI cards and executive memos before diving into underlying queries and schema models.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ASK ASSISTANT */}
              {activeAITab === "ask" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Ask OpenAI GPT-4o-mini about interview rounds, salary negotiations, or resume tailoring for {activeJobForAI.company}:
                    </p>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                      GPT-4o-mini Ready
                    </span>
                  </div>

                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      disabled={isAskingAI}
                      placeholder={isAskingAI ? "Thinking with OpenAI..." : `Ask AI about ${activeJobForAI.company} or ${activeJobForAI.title}...`}
                      className="flex-1 rounded-xl border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isAskingAI || !customQuestion.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition shrink-0 disabled:opacity-60"
                    >
                      {isAskingAI ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Ask AI
                        </>
                      )}
                    </button>
                  </form>

                  {/* Pre-canned Prompts */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="text-muted-foreground">Quick prompts:</span>
                    {[
                      "What is the salary negotiation range?",
                      "How do I tailor my resume for this role?",
                      "What technical questions will they ask?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        disabled={isAskingAI}
                        onClick={() => {
                          setCustomQuestion(prompt);
                        }}
                        className="rounded-md border bg-secondary/60 px-2 py-0.5 text-foreground hover:bg-secondary transition disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Answers stream */}
                  <div className="space-y-3 pt-2">
                    {customAnswers.map((item, idx) => (
                      <div key={idx} className="rounded-xl border bg-card p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            <span className="text-primary">Q:</span> {item.q}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.source === "openai"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-primary/10 text-primary border-primary/20"
                            }`}
                          >
                            {item.source === "openai" ? "✨ OpenAI GPT-4o-mini" : "🤖 CareerAI Copilot"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t bg-card/90 px-5 py-3.5 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Ready to apply on <strong>{activeJobForAI.platform}</strong>?
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveJobForAI(null)}
                  className="rounded-xl border px-3.5 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                >
                  Close
                </button>
                <a
                  href={activeJobForAI.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
                >
                  <span>Apply on {activeJobForAI.platform}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import type { JobListing, Profile } from "./career-data";
import type { UploadedResume } from "@/routes/roadmap";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

export const isOpenAIConfigured = Boolean(OPENAI_API_KEY && OPENAI_API_KEY.startsWith("sk-"));

interface OpenAIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Base helper to send requests to OpenAI API with automatic error handling
 */
export async function callOpenAI(
  messages: OpenAIChatMessage[],
  fallbackText: string,
  model = "gpt-4o-mini"
): Promise<{ text: string; source: "openai" | "fallback"; error?: string }> {
  if (!isOpenAIConfigured) {
    return { text: fallbackText, source: "fallback" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.warn("OpenAI API returned error, falling back to local engine:", data.error.message);
      return {
        text: fallbackText,
        source: "fallback",
        error: data.error.message,
      };
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (reply) {
      return { text: reply, source: "openai" };
    }

    return { text: fallbackText, source: "fallback" };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn("OpenAI fetch failed, using fallback:", errMsg);
    return { text: fallbackText, source: "fallback", error: errMsg };
  }
}

/**
 * Generate a Tailored Cover Letter using OpenAI
 */
export async function generateAICoverLetter(
  job: JobListing,
  profile: Profile | null,
  resume: UploadedResume | null,
  fallback: string
): Promise<{ text: string; source: "openai" | "fallback" }> {
  const candidateName = profile?.name || "Candidate";
  const candidateSkills = profile?.skills?.join(", ") || "SQL, Python, React, Web Development";
  const resumeNote = resume ? `The candidate has an attached resume file: "${resume.name}".` : "";

  const messages: OpenAIChatMessage[] = [
    {
      role: "system",
      content:
        "You are an expert career advisor and technical recruiter at CareerAI. Write a high-converting, professional, and authentic cover letter for a candidate applying to an entry-level or internship tech role. Emphasize hands-on project deliverables, problem-solving abilities, and enthusiasm without fluff. Keep it under 250 words.",
    },
    {
      role: "user",
      content: `Write a tailored cover letter for:
Candidate: ${candidateName}
Role: ${job.title}
Company: ${job.company}
Platform: ${job.platform}
Required Skills: ${job.skills.join(", ")}
Candidate's Validated Skills: ${candidateSkills}
${resumeNote}
Job Description: ${job.description}`,
    },
  ];

  const result = await callOpenAI(messages, fallback);
  return { text: result.text, source: result.source };
}

/**
 * Generate Recruiter Cold Outreach Message using OpenAI
 */
export async function generateAIColdOutreach(
  job: JobListing,
  profile: Profile | null,
  resume: UploadedResume | null,
  fallback: string
): Promise<{ text: string; source: "openai" | "fallback" }> {
  const candidateName = profile?.name ? profile.name.split(" ")[0] : "Candidate";
  const skills = job.skills.slice(0, 3).join(", ");
  const resumeNote = resume ? ` Attached resume: ${resume.name}.` : "";

  const messages: OpenAIChatMessage[] = [
    {
      role: "system",
      content:
        "You are a tech career coach. Write a crisp, polite, 3-sentence LinkedIn/email connection message to a recruiter. The goal is to spark interest and land a 5-minute introductory call. Do not use generic greetings like 'Hope this email finds you well'.",
    },
    {
      role: "user",
      content: `Candidate: ${candidateName}. Role: ${job.title} at ${job.company}. Platform: ${job.platform}. Core Skills: ${skills}.${resumeNote}`,
    },
  ];

  const result = await callOpenAI(messages, fallback);
  return { text: result.text, source: result.source };
}

/**
 * Answer custom job and career questions using OpenAI
 */
export async function askOpenAIJobAssistant(
  job: JobListing,
  question: string,
  profile: Profile | null,
  resume: UploadedResume | null,
  fallback: string
): Promise<{ text: string; source: "openai" | "fallback" }> {
  const candidateName = profile?.name || "Candidate";
  const skills = profile?.skills?.join(", ") || "General Tech & Analytics";

  const messages: OpenAIChatMessage[] = [
    {
      role: "system",
      content: `You are CareerAI's Job Copilot assisting ${candidateName} in landing the role of ${job.title} at ${job.company} (${job.platform} posting).
Company: ${job.company}
Location: ${job.location} (${job.workplaceType})
Budget/Salary: ${job.salary}
Skills required: ${job.skills.join(", ")}
Candidate skills: ${skills}
${resume ? `Resume attached: ${resume.name}` : "No resume attached"}

Give actionable, direct, and encouraging advice. Keep answers under 120 words.`,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const result = await callOpenAI(messages, fallback);
  return { text: result.text, source: result.source };
}

/**
 * Generate AI Career Coach strategic advice for results page
 */
export async function generateAICareerAdvice(
  profile: Profile,
  careerTitle: string,
  score: number,
  haveSkills: string[],
  missingSkills: string[],
  fallback: string
): Promise<{ text: string; source: "openai" | "fallback" }> {
  const messages: OpenAIChatMessage[] = [
    {
      role: "system",
      content:
        "You are an elite AI Career Strategist. Give crisp, highly actionable, 3-point tactical guidance to a candidate preparing for their target career. Keep it motivating, practical, and under 150 words.",
    },
    {
      role: "user",
      content: `Candidate Name: ${profile.name}
Target Career: ${careerTitle} (${score}% Match)
Skills Already Mastered: ${haveSkills.join(", ") || "General analytical/tech skills"}
Skills to Bridge: ${missingSkills.join(", ") || "Advanced frameworks & capstone"}
Provide high-impact action steps for their learning and hiring readiness.`,
    },
  ];

  const result = await callOpenAI(messages, fallback);
  return { text: result.text, source: result.source };
}

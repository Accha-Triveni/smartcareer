import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Read environment variables (supports Vite env or window/process fallback)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if a real project URL has been configured
export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes("your-project-ref") &&
  Boolean(supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Test connectivity to the configured Supabase instance
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message:
        "Supabase Project URL is missing. Please provide your Supabase Project URL (e.g., https://xyz.supabase.co).",
    };
  }

  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error && error.code !== "PGRST116" && !error.message.includes("does not exist")) {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: "Connected to Supabase successfully!" };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { connected: false, message: errorMessage };
  }
}

/**
 * Sync candidate profile to Supabase
 */
export async function syncProfileToSupabase(profileData: {
  name: string;
  interest: string;
  skills: string[];
  education: string;
  experience: string;
}) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase.from("profiles").upsert(
      {
        name: profileData.name,
        interest: profileData.interest,
        skills: profileData.skills,
        education: profileData.education,
        experience: profileData.experience,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "name" }
    );

    if (error) {
      console.warn("Supabase profile sync error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Error syncing profile to Supabase:", err);
    return null;
  }
}

/**
 * Sync roadmap progress to Supabase
 */
export async function syncRoadmapProgressToSupabase(payload: {
  track: string;
  completedMilestones: string[];
  completedWeeks: string[];
  completedTasks: string[];
}) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase.from("roadmap_progress").upsert(
      {
        track: payload.track,
        completed_milestones: payload.completedMilestones,
        completed_weeks: payload.completedWeeks,
        completed_tasks: payload.completedTasks,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "track" }
    );

    if (error) {
      console.warn("Supabase roadmap sync error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Error syncing roadmap to Supabase:", err);
    return null;
  }
}

/**
 * Sync uploaded resume metadata to Supabase
 */
export async function syncResumeToSupabase(resumeData: {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase.from("candidate_resumes").upsert(
      {
        file_name: resumeData.name,
        file_size: resumeData.size,
        file_type: resumeData.type,
        uploaded_at: resumeData.uploadedAt,
      },
      { onConflict: "file_name" }
    );

    if (error) {
      console.warn("Supabase resume sync error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Error syncing resume to Supabase:", err);
    return null;
  }
}

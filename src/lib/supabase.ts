
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are properly set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
    Error: Missing Supabase credentials. 
    Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY 
    in your environment variables (.env file).
    
    You can get these values from your Supabase project settings > API.
  `);
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for our database schema
export type DbObjective = {
  id: string;
  title: string;
  description: string;
  kpi: string;
  weight: number;
  target: string;
  progress: number;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  due_date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

// Type for our application's Objective object
export type Objective = {
  id: string;
  title: string;
  description: string;
  kpi: string;
  weight: number;
  target: string;
  progress: number;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  dueDate: string;
};

// Utility to map DB types to our application types
export const mapDbObjectiveToObjective = (dbObjective: DbObjective): Objective => ({
  id: dbObjective.id,
  title: dbObjective.title,
  description: dbObjective.description,
  kpi: dbObjective.kpi,
  weight: dbObjective.weight,
  target: dbObjective.target,
  progress: dbObjective.progress,
  status: dbObjective.status,
  dueDate: dbObjective.due_date,
});

// Utility to map application types to DB types (for inserts/updates)
export const mapObjectiveToDbObjective = (objective: Partial<Objective>, userId: string): Partial<DbObjective> => ({
  ...(objective.id && { id: objective.id }),
  ...(objective.title && { title: objective.title }),
  ...(objective.description && { description: objective.description }),
  ...(objective.kpi && { kpi: objective.kpi }),
  ...(objective.weight !== undefined && { weight: objective.weight }),
  ...(objective.target && { target: objective.target }),
  ...(objective.progress !== undefined && { progress: objective.progress }),
  ...(objective.status && { status: objective.status }),
  ...(objective.dueDate && { due_date: objective.dueDate }),
  user_id: userId,
});

// Profile type definition
export type Profile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  department: string | null;
  manager: string | null;
  avatarUrl: string | null;
};

export type DbProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  department: string | null;
  manager: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export const mapDbProfileToProfile = (dbProfile: DbProfile): Profile => ({
  id: dbProfile.id,
  firstName: dbProfile.first_name,
  lastName: dbProfile.last_name,
  position: dbProfile.position,
  department: dbProfile.department,
  manager: dbProfile.manager,
  avatarUrl: dbProfile.avatar_url,
});

export const mapProfileToDbProfile = (profile: Partial<Profile>): Partial<DbProfile> => ({
  ...(profile.id && { id: profile.id }),
  ...(profile.firstName !== undefined && { first_name: profile.firstName }),
  ...(profile.lastName !== undefined && { last_name: profile.lastName }),
  ...(profile.position !== undefined && { position: profile.position }),
  ...(profile.department !== undefined && { department: profile.department }),
  ...(profile.manager !== undefined && { manager: profile.manager }),
  ...(profile.avatarUrl !== undefined && { avatar_url: profile.avatarUrl }),
});

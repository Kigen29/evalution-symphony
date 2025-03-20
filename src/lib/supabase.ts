
import { createClient } from '@supabase/supabase-js';

// These environment variables will be set after connecting to Supabase in the Lovable interface
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  id: number;
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
  id: parseInt(dbObjective.id), // This should be changed if we're using UUIDs
  title: dbObjective.title,
  description: dbObjective.description,
  kpi: dbObjective.kpi,
  weight: dbObjective.weight,
  target: dbObjective.target,
  progress: dbObjective.progress,
  status: dbObjective.status as "On Track" | "At Risk" | "Delayed" | "Completed",
  dueDate: dbObjective.due_date,
});

// Utility to map application types to DB types (for inserts/updates)
export const mapObjectiveToDbObjective = (objective: Partial<Objective>, userId: string): Partial<DbObjective> => ({
  ...(objective.id && { id: objective.id.toString() }),
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

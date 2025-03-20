
-- Create objectives table
CREATE TABLE IF NOT EXISTS objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  kpi TEXT NOT NULL,
  weight INTEGER NOT NULL CHECK (weight >= 0 AND weight <= 100),
  target TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL CHECK (status IN ('On Track', 'At Risk', 'Delayed', 'Completed')),
  due_date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own objectives
CREATE POLICY "Users can view their own objectives"
  ON objectives FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own objectives
CREATE POLICY "Users can insert their own objectives"
  ON objectives FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own objectives
CREATE POLICY "Users can update their own objectives"
  ON objectives FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own objectives
CREATE POLICY "Users can delete their own objectives"
  ON objectives FOR DELETE
  USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS objectives_user_id_idx ON objectives (user_id);

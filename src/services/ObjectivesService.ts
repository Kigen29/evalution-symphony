import { supabase, Objective, DbObjective, mapDbObjectiveToObjective, mapObjectiveToDbObjective } from '@/lib/supabase';

export const getObjectives = async (filters?: {
  status?: string;
  dueDate?: { before?: string; after?: string };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<Objective[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    let query = supabase
      .from('objectives')
      .select('*')
      .eq('user_id', user.user.id);
      
    // Apply filters if provided
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.dueDate?.before) {
      query = query.lte('due_date', filters.dueDate.before);
    }
    
    if (filters?.dueDate?.after) {
      query = query.gte('due_date', filters.dueDate.after);
    }
    
    // Apply sorting if provided
    if (filters?.sortBy) {
      const order = filters.sortOrder || 'desc';
      query = query.order(filters.sortBy, { ascending: order === 'asc' });
    } else {
      // Default sorting by created_at descending
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching objectives:', error);
      return [];
    }
    
    return data.map(mapDbObjectiveToObjective);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return [];
  }
};

export const getObjective = async (id: string): Promise<Objective | null> => {
  try {
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching objective with id ${id}:`, error);
      return null;
    }
    
    return mapDbObjectiveToObjective(data as DbObjective);
  } catch (error) {
    console.error(`Error fetching objective with id ${id}:`, error);
    return null;
  }
};

export const createObjective = async (objective: Omit<Objective, 'id' | 'progress'>): Promise<Objective | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const newObjective = {
      ...objective,
      progress: 0,
    };
    
    const dbObjective = mapObjectiveToDbObjective(newObjective, user.user.id);
    
    const { data, error } = await supabase
      .from('objectives')
      .insert([dbObjective])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating objective:', error);
      return null;
    }
    
    return mapDbObjectiveToObjective(data as DbObjective);
  } catch (error) {
    console.error('Error creating objective:', error);
    return null;
  }
};

export const updateObjective = async (id: string, updates: Partial<Objective>): Promise<Objective | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const dbUpdates = mapObjectiveToDbObjective(updates, user.user.id);
    
    const { data, error } = await supabase
      .from('objectives')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating objective with id ${id}:`, error);
      return null;
    }
    
    return mapDbObjectiveToObjective(data as DbObjective);
  } catch (error) {
    console.error(`Error updating objective with id ${id}:`, error);
    return null;
  }
};

export const updateObjectiveProgress = async (id: string, progress: number): Promise<Objective | null> => {
  return updateObjective(id, { progress });
};

export const deleteObjective = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('objectives')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting objective with id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting objective with id ${id}:`, error);
    return false;
  }
};

export const getObjectivesByStatus = async (status: string): Promise<Objective[]> => {
  return getObjectives({ status });
};

export const getUpcomingObjectives = async (daysAhead: number = 30): Promise<Objective[]> => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  return getObjectives({
    dueDate: {
      after: today.toISOString().split('T')[0],
      before: futureDate.toISOString().split('T')[0]
    },
    status: 'On Track'
  });
};

export const getObjectivesByProgressRange = async (minProgress: number, maxProgress: number): Promise<Objective[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('user_id', user.user.id)
      .gte('progress', minProgress)
      .lte('progress', maxProgress)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching objectives by progress range:', error);
      return [];
    }
    
    return data.map(mapDbObjectiveToObjective);
  } catch (error) {
    console.error('Error fetching objectives by progress range:', error);
    return [];
  }
};

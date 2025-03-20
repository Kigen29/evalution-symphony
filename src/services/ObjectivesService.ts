
import { supabase, Objective, DbObjective, mapDbObjectiveToObjective, mapObjectiveToDbObjective } from '@/lib/supabase';

export const getObjectives = async (): Promise<Objective[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data.map(mapDbObjectiveToObjective);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    throw error;
  }
};

export const getObjective = async (id: number): Promise<Objective | null> => {
  try {
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('id', id.toString())
      .single();
      
    if (error) {
      throw error;
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
      throw error;
    }
    
    return mapDbObjectiveToObjective(data as DbObjective);
  } catch (error) {
    console.error('Error creating objective:', error);
    throw error;
  }
};

export const updateObjective = async (id: number, updates: Partial<Objective>): Promise<Objective | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const dbUpdates = mapObjectiveToDbObjective(updates, user.user.id);
    
    const { data, error } = await supabase
      .from('objectives')
      .update(dbUpdates)
      .eq('id', id.toString())
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapDbObjectiveToObjective(data as DbObjective);
  } catch (error) {
    console.error(`Error updating objective with id ${id}:`, error);
    throw error;
  }
};

export const updateObjectiveProgress = async (id: number, progress: number): Promise<Objective | null> => {
  return updateObjective(id, { progress });
};

export const deleteObjective = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('objectives')
      .delete()
      .eq('id', id.toString());
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting objective with id ${id}:`, error);
    return false;
  }
};

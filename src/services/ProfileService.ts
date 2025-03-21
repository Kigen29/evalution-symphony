
import { supabase, Profile, DbProfile, mapDbProfileToProfile, mapProfileToDbProfile } from '@/lib/supabase';

export const getProfile = async (): Promise<Profile> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    return mapDbProfileToProfile(data as DbProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const updates = mapProfileToDbProfile({
      ...profile,
      id: user.user.id
    });
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return mapDbProfileToProfile(data as DbProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

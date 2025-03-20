
import { supabase } from '@/lib/supabase';

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  department: string | null;
  manager: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

export const uploadProfilePicture = async (file: File): Promise<string | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.user.id}/avatar.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      return null;
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    // Update profile with new avatar URL
    await updateProfile({ avatar_url: data.publicUrl });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
};


import { supabase } from "@/lib/supabase";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  manager_id?: string;
  avatar_url?: string;
  created_at: string;
};

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
};

export const getProfile = async (): Promise<Profile | null> => {
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
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const updateProfile = async (profileData: ProfileFormData): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const updates = {
      id: user.user.id,
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
      department: profileData.department,
      position: profileData.position,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(updates)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

export const uploadAvatar = async (file: File): Promise<string | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No user logged in');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);
      
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', user.user.id);
      
    if (updateError) {
      throw updateError;
    }
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
};

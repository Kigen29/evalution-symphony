
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Profile, getProfile } from '@/services/ProfileService';
import { useToast } from '@/components/ui/use-toast';

type UserContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        getProfile().then(profile => {
          setProfile(profile);
          setIsLoading(false);
        }).catch(() => {
          toast({
            title: "Failed to load profile",
            description: "Please try refreshing the page",
            variant: "destructive"
          });
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          getProfile().then(setProfile).catch(console.error);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const updatedProfile = await getProfile();
        setProfile(updatedProfile);
        return;
      } catch (error) {
        console.error("Error refreshing profile:", error);
        toast({
          title: "Error refreshing profile",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <UserContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading,
      signOut,
      refreshProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

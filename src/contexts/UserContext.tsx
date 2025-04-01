
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { getProfile } from '@/services/ProfileService';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/lib/supabase';
import { signOut as authSignOut } from '@/services/AuthService';

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Use setTimeout to prevent potential auth deadlocks
        if (session?.user) {
          setTimeout(() => {
            getProfile()
              .then(setProfile)
              .catch(err => {
                console.error("Error fetching profile during auth change:", err);
                // Don't show a toast here to prevent UI clutter during transitions
              });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        getProfile()
          .then(profile => {
            setProfile(profile);
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Error fetching initial profile:", err);
            toast({
              title: "Could not load profile",
              description: "Please try refreshing the page",
              variant: "destructive"
            });
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }).catch(err => {
      console.error("Error getting session:", err);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authSignOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isDelivery: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAdmin: false,
    isDelivery: false
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAdmin: false,
          isDelivery: false
        });
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAdmin: false,
          isDelivery: false
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setState({
        user,
        profile,
        isLoading: false,
        isAdmin: profile?.role === 'admin',
        isDelivery: profile?.role === 'delivery'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setState({
        user,
        profile: null,
        isLoading: false,
        isAdmin: false,
        isDelivery: false
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }

    return data;
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone
        }
      }
    });

    if (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        phone,
        role: 'customer'
      });
    }

    return data;
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }

    setState({
      user: null,
      profile: null,
      isLoading: false,
      isAdmin: false,
      isDelivery: false
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id)
      .select()
      .single();

    if (error) throw error;

    setState(prev => ({
      ...prev,
      profile: data,
      isAdmin: data.role === 'admin',
      isDelivery: data.role === 'delivery'
    }));

    return data;
  };

  return {
    user: state.user,
    profile: state.profile,
    isLoading: state.isLoading,
    isAdmin: state.isAdmin,
    isDelivery: state.isDelivery,
    isAuthenticated: !!state.user,
    signIn,
    signUp,
    signOut,
    updateProfile
  };
}

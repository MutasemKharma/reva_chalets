import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // ⚠️ PROTECTED FUNCTION - DO NOT MODIFY OR ADD ASYNC OPERATIONS
  // This is a Supabase auth state change listener that must remain synchronous
  const handleAuthStateChange = (event, session) => {
    // SYNC OPERATIONS ONLY - NO ASYNC/AWAIT ALLOWED
    if (session?.user) {
      setUser(session?.user)
      // Load user role when user changes
      loadUserRole(session?.user?.id)
    } else {
      setUser(null)
      setUserRole(null)
    }
    setLoading(false)
  }

  const loadUserRole = async (userId) => {
    try {
      const { data: profile, error } = await supabase?.from('profiles')?.select('role')?.eq('id', userId)?.single()

      if (error) throw error
      
      setUserRole(profile?.role || 'guest')
    } catch (error) {
      console.error('Error loading user role:', error)
      setUserRole('guest')
    }
  }

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          loadUserRole(session?.user?.id)
        } else {
          setLoading(false)
        }
      })

    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(handleAuthStateChange)

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase?.auth?.signOut()
    if (!error) {
      setUser(null)
      setUserRole(null)
    }
    return { error }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') }
    
    const { data, error } = await supabase?.from('profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
    
    return { data, error }
  }

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider
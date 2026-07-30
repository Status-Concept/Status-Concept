import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { sanitizePhone, sanitizeText } from '../utils/sanitize'

const AuthContext = createContext(null)
// Client authentication is intentionally paused. Keep the login surface
// available as a clear endpoint without making auth requests until the client
// area is deliberately re-enabled.
export const AUTH_ENABLED = false

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(AUTH_ENABLED && isSupabaseConfigured)

  const fetchProfile = useCallback(async (userId) => {
    const supabase = await getSupabase()
    if (!supabase || !userId) {
      setProfile(null)
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, phone, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) {
      setProfile(null)
      return null
    }

    const cleanProfile = {
      ...data,
      name: sanitizeText(data.name),
      phone: sanitizePhone(data.phone),
    }
    setProfile(cleanProfile)
    return cleanProfile
  }, [])

  useEffect(() => {
    let mounted = true
    let listener = null

    if (!AUTH_ENABLED || !isSupabaseConfigured) {
      return undefined
    }

    getSupabase().then((supabase) => {
      if (!mounted || !supabase) return

      supabase.auth.getSession().then(async ({ data }) => {
        if (!mounted) return
        setSession(data.session)
        setUser(data.session?.user || null)
        if (data.session?.user) await fetchProfile(data.session.user.id)
        setLoading(false)
      })

      listener = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        setUser(nextSession?.user || null)
        if (nextSession?.user) fetchProfile(nextSession.user.id)
        else setProfile(null)
        setLoading(false)
      }).data
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const login = useCallback(async ({ email, password }) => {
    if (!AUTH_ENABLED) throw new Error('A area de cliente esta temporariamente indisponivel.')
    const supabase = await getSupabase()
    if (!supabase) throw new Error('Supabase nao esta configurado.')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizeText(email).toLowerCase(),
      password,
    })
    if (error) throw error
    if (data.user) await fetchProfile(data.user.id)
    return data
  }, [fetchProfile])

  const register = useCallback(async ({ name, email, password, phone }) => {
    if (!AUTH_ENABLED) throw new Error('A area de cliente esta temporariamente indisponivel.')
    const supabase = await getSupabase()
    if (!supabase) throw new Error('Supabase nao esta configurado.')
    const cleanName = sanitizeText(name)
    const cleanPhone = sanitizePhone(phone)

    const { data, error } = await supabase.auth.signUp({
      email: sanitizeText(email).toLowerCase(),
      password,
      options: {
        data: {
          name: cleanName,
          phone: cleanPhone,
        },
      },
    })

    if (error) throw error

    if (data.user && data.session && cleanPhone) {
      await supabase
        .from('profiles')
        .update({ phone: cleanPhone, updated_at: new Date().toISOString() })
        .eq('id', data.user.id)
    }

    return data
  }, [])

  const updateProfile = useCallback(async ({ name, phone }) => {
    if (!AUTH_ENABLED) throw new Error('A area de cliente esta temporariamente indisponivel.')
    const supabase = await getSupabase()
    if (!supabase || !user) throw new Error('Sessao invalida.')
    const payload = {
      name: sanitizeText(name),
      phone: sanitizePhone(phone),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...payload }, { onConflict: 'id' })
      .select('id, name, phone, created_at, updated_at')
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }, [user])

  const logout = useCallback(async () => {
    if (!AUTH_ENABLED) return
    const supabase = await getSupabase()
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    isSupabaseConfigured,
    isAuthEnabled: AUTH_ENABLED,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile: () => fetchProfile(user?.id),
  }), [session, user, profile, loading, login, register, logout, updateProfile, fetchProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

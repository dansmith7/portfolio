import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../lib/dataApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 8000)
    api.authGetSession().then((u) => {
      if (!cancelled) setUser(u)
    }).finally(() => {
      if (!cancelled) {
        clearTimeout(timeout)
        setLoading(false)
      }
    })
    const unsub = api.authOnStateChange((u) => {
      if (!cancelled) setUser(u)
    })
    return () => {
      cancelled = true
      clearTimeout(timeout)
      unsub()
    }
  }, [])

  const signIn = async (email, password) => {
    const data = await api.authSignIn(email, password)
    setUser(data?.user ?? { token: true })
    return data
  }

  const signOut = async () => {
    await api.authSignOut()
    setUser(null)
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

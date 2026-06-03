import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface InteractionDebugContextValue {
  enabled:    boolean
  toggle:     () => void
  setEnabled: (v: boolean) => void
}

const InteractionDebugContext = createContext<InteractionDebugContextValue | null>(null)

export function InteractionDebugProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  const toggle = useCallback(() => setEnabled(v => !v), [])

  useEffect(() => {
    if (!import.meta.env.DEV) return

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return (
    <InteractionDebugContext.Provider value={{ enabled, toggle, setEnabled }}>
      {children}
    </InteractionDebugContext.Provider>
  )
}

export function useInteractionDebug() {
  const ctx = useContext(InteractionDebugContext)
  if (!ctx) {
    return { enabled: false, toggle: () => {}, setEnabled: () => {} }
  }
  return ctx
}

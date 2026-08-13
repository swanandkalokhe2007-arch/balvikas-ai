import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Child } from '../types'
import { useData } from './DataContext'

type Sel = {
  activeChild: Child | null
  children: Child[]
  setActiveChildId: (id: string) => void
}

const Ctx = createContext<Sel | null>(null)
const KEY = 'balvikas_child'

export function ChildSelectionProvider({ children: tree }: { children: ReactNode }) {
  // Always use myChildren (scoped list). Never fall back to empty filter bugs.
  const { myChildren } = useData()
  const list = myChildren
  const [id, setId] = useState(() => {
    try {
      return localStorage.getItem(KEY) || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    if (!list.length) {
      setId('')
      return
    }
    if (!id || !list.some((c) => c.id === id)) {
      setId(list[0].id)
    }
  }, [list, id])

  useEffect(() => {
    try {
      if (id) localStorage.setItem(KEY, id)
      else localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }, [id])

  const value = useMemo(() => {
    const activeChild = (id && list.find((c) => c.id === id)) || list[0] || null
    return { activeChild, children: list, setActiveChildId: setId }
  }, [list, id])

  return <Ctx.Provider value={value}>{tree}</Ctx.Provider>
}

export function useActiveChild() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useActiveChild outside provider')
  return v
}

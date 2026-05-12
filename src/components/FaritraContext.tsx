import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Faritra, Personne } from "../data/faritra"
import { faritraList as initialData } from "../data/faritra"

type FaritraContextType = {
  faritraList: Faritra[]
  addPersonne: (faritraId: string, personne: Omit<Personne, "id">) => void
  updatePersonne: (faritraId: string, personneId: number, data: Partial<Personne>) => void
  deletePersonne: (faritraId: string, personneId: number) => void
  markDeces: (faritraId: string, personneId: number) => void
  getNextId: (faritraId: string) => number
}

const FaritraContext = createContext<FaritraContextType | null>(null)

export function FaritraProvider({ children }: { children: ReactNode }) {
  const [faritraList, setFaritraList] = useState<Faritra[]>(initialData)

  const addPersonne = useCallback((faritraId: string, personne: Omit<Personne, "id">) => {
    setFaritraList((prev) =>
      prev.map((f) => {
        if (f.id !== faritraId) return f
        const maxId = f.personnes.reduce((max, p) => Math.max(max, p.id), 0)
        return { ...f, personnes: [...f.personnes, { ...personne, id: maxId + 1 }] }
      })
    )
  }, [])

  const updatePersonne = useCallback((faritraId: string, personneId: number, data: Partial<Personne>) => {
    setFaritraList((prev) =>
      prev.map((f) => {
        if (f.id !== faritraId) return f
        return {
          ...f,
          personnes: f.personnes.map((p) => (p.id === personneId ? { ...p, ...data } : p)),
        }
      })
    )
  }, [])

  const deletePersonne = useCallback((faritraId: string, personneId: number) => {
    setFaritraList((prev) =>
      prev.map((f) => {
        if (f.id !== faritraId) return f
        return { ...f, personnes: f.personnes.filter((p) => p.id !== personneId) }
      })
    )
  }, [])

  const markDeces = useCallback((faritraId: string, personneId: number) => {
    setFaritraList((prev) =>
      prev.map((f) => {
        if (f.id !== faritraId) return f
        return {
          ...f,
          personnes: f.personnes.map((p) => (p.id === personneId ? { ...p, deces: !p.deces } : p)),
        }
      })
    )
  }, [])

  const getNextId = useCallback((faritraId: string) => {
    const faritra = faritraList.find((f) => f.id === faritraId)
    if (!faritra) return 1
    return faritra.personnes.reduce((max, p) => Math.max(max, p.id), 0) + 1
  }, [faritraList])

  return (
    <FaritraContext.Provider value={{ faritraList, addPersonne, updatePersonne, deletePersonne, markDeces, getNextId }}>
      {children}
    </FaritraContext.Provider>
  )
}

export function useFaritra() {
  const ctx = useContext(FaritraContext)
  if (!ctx) throw new Error("useFaritra must be used within FaritraProvider")
  return ctx
}

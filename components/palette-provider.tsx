'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface PaletteContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggle: () => void
}

const PaletteContext = createContext<PaletteContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
})

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((value) => !value), [])

  return (
    <PaletteContext.Provider value={{ open, setOpen, toggle }}>{children}</PaletteContext.Provider>
  )
}

export function usePalette(): PaletteContextValue {
  return useContext(PaletteContext)
}

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Coords } from '../types'

interface LocationContextValue {
  location: Coords | null
  loading: boolean
  error: string | null
  setManualLocation: (latitude: number, longitude: number) => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Coords | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị GPS')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.code === 1 ? 'Bạn đã từ chối quyền truy cập vị trí' : 'Không thể lấy vị trí hiện tại')
        setLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [])

  const setManualLocation = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude })
    setError(null)
  }

  return (
    <LocationContext.Provider value={{ location, loading, error, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used within LocationProvider')
  return ctx
}

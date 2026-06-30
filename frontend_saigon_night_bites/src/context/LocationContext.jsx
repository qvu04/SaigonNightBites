import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị GPS')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        if (err.code === 1) {
          setError('Bạn đã từ chối quyền truy cập vị trí')
        } else {
          setError('Không thể lấy vị trí hiện tại')
        }
        setLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [])

  const setManualLocation = (latitude, longitude) => {
    setLocation({ latitude, longitude })
    setError(null)
  }

  return (
    <LocationContext.Provider value={{ location, loading, error, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used within LocationProvider')
  return ctx
}

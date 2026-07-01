import { create } from 'zustand'
import type { Coords } from '../types'

interface LocationState {
  location: Coords | null
  loading: boolean
  error: string | null
}

interface LocationActions {
  initGPS: () => void
  setManualLocation: (latitude: number, longitude: number) => void
}

export const useLocationStore = create<LocationState & LocationActions>((set) => ({
  location: null,
  loading: true,
  error: null,

  initGPS: () => {
    if (!navigator.geolocation) {
      set({ error: 'Trình duyệt không hỗ trợ định vị GPS', loading: false })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({
          location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          loading: false,
        })
      },
      (err) => {
        set({
          error: err.code === 1
            ? 'Bạn đã từ chối quyền truy cập vị trí'
            : 'Không thể lấy vị trí hiện tại',
          loading: false,
        })
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  },

  setManualLocation: (latitude, longitude) => {
    set({ location: { latitude, longitude }, error: null })
  },
}))

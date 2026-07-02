import api from './axios'
import type { ApiResponse, Place } from '../types'
import type { AxiosResponse } from 'axios'

interface SearchInput { keywords: string[]; reason?: string; latitude: number; longitude: number; radius: number }
interface PlacesData { places: Place[]; totalFound: number }

export const searchPlaces = ({ keywords, reason, latitude, longitude, radius }: SearchInput): Promise<AxiosResponse<ApiResponse<PlacesData>>> =>
  api.get('/places/search', {
    params: {
      keywords: keywords.join(','),
      reason,
      latitude,
      longitude,
      radius,
    },
  })

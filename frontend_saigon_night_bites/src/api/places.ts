import api from './axios'
import type { ApiResponse, Place } from '../types'
import type { AxiosResponse } from 'axios'

interface SearchInput { keywords: string[]; latitude: number; longitude: number; radius: number }
interface PlacesData { places: Place[]; totalFound: number }

export const searchPlaces = ({ keywords, latitude, longitude, radius }: SearchInput): Promise<AxiosResponse<ApiResponse<PlacesData>>> =>
  api.get('/places/search', {
    params: {
      keywords: keywords.join(','),
      latitude,
      longitude,
      radius,
    },
  })

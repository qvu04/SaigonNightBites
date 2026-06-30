import api from './axios'
import type { ApiResponse, FavoritePlace, Place } from '../types'
import type { AxiosResponse } from 'axios'

type AddFavoriteInput = Omit<Place, 'user_ratings_total' | 'open_now' | 'distance'>

export const getFavorites = (): Promise<AxiosResponse<ApiResponse<{ favorites: FavoritePlace[] }>>> =>
  api.get('/favorites')

export const addFavorite = (place: AddFavoriteInput): Promise<AxiosResponse<ApiResponse<{ favorite: FavoritePlace }>>> =>
  api.post('/favorites', place)

export const removeFavorite = (id: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> =>
  api.delete(`/favorites/${id}`)

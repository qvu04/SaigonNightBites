import api from './axios'
import type { ApiResponse, SearchHistoryItem } from '../types'
import type { AxiosResponse } from 'axios'

export const getHistory = (): Promise<AxiosResponse<ApiResponse<{ history: SearchHistoryItem[] }>>> =>
  api.get('/history')

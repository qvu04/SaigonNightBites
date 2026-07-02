import api from './axios'
import type { ApiResponse, Mood, Budget, AIRecommendation, ProsConsInsight } from '../types'
import type { AxiosResponse } from 'axios'

interface RecommendInput { mood: Mood; budget: Budget; radius: number; latitude: number; longitude: number }
interface RecommendData extends AIRecommendation { historyId: string | null }

export const getAIRecommendation = (input: RecommendInput): Promise<AxiosResponse<ApiResponse<RecommendData>>> =>
  api.post('/ai/recommend', input)

export const getPlaceInsights = (name: string): Promise<AxiosResponse<ApiResponse<ProsConsInsight>>> =>
  api.post('/ai/insights', { name })

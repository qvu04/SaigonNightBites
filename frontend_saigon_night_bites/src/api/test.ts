import api from './axios'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '../types'

interface KeyResult {
  ok: boolean
  message: string
  latencyMs: number | null
}

interface TestKeysData {
  gemini: KeyResult
  places: KeyResult
}

export const testApiKeys = (): Promise<AxiosResponse<ApiResponse<TestKeysData>>> =>
  api.get('/test/keys')

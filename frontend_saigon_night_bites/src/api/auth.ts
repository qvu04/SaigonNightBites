import api from './axios'
import type { ApiResponse, User } from '../types'
import type { AxiosResponse } from 'axios'

interface LoginData { token: string; user: User }
interface RegisterData { user: Pick<User, 'id' | 'email'> }

export const registerUser = (email: string, password: string): Promise<AxiosResponse<ApiResponse<RegisterData>>> =>
  api.post('/auth/register', { email, password })

export const loginUser = (email: string, password: string): Promise<AxiosResponse<ApiResponse<LoginData>>> =>
  api.post('/auth/login', { email, password })

import axios from "axios";
import { TLogin, TRegister } from "../schemas";
import { apiConfig } from "./apiConfig";
import { ApiResponse, User } from '../types';
export interface LoginData {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string;
  user: User;
}

export interface RefreshData {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string;
}

interface RegisterData { user: Pick<User, 'id' | 'email'> }

export const authService = {
  login: async (payload: TLogin): Promise<ApiResponse<LoginData>> => {
    const res = await apiConfig.post('/auth/login', payload);
    return res.data;
  },

  register: async (payload: TRegister): Promise<ApiResponse<RegisterData>> => {
    const res = await apiConfig.post('/auth/register', payload);
    return res.data;
  },

  // Use plain axios — must not go through apiConfig interceptor
  refresh: async (refreshToken: string): Promise<ApiResponse<RefreshData>> => {
    const res = await apiConfig.post('/auth/refresh', { refreshToken });
    return res.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiConfig.post('/auth/logout', { refreshToken }).catch(() => {
      // Fire-and-forget: clear local session even if server call fails
    });
  },
};
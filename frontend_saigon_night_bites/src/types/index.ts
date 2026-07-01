export type Mood = 'tired' | 'happy' | 'date' | 'group' | 'sweet' | 'savory';
export type Budget = 'low' | 'mid' | 'high';
export type Theme = 'dark' | 'light';

export interface User {
  id: string;
  email: string;
}

export interface Coords {
  latitude: number;
  longitude: number;
}

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface Place {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  location: PlaceLocation | null;
  open_now: boolean;
  photo_url: string | null;
  distance: number | null;
}

export interface FavoritePlace {
  id: string;
  place_id: string;
  name: string;
  rating: number | null;
  vicinity: string | null;
  location: PlaceLocation | null;
  photo_url: string | null;
  created_at: string;
}

export interface SearchHistoryItem {
  id: string;
  mood: Mood;
  budget: Budget;
  radius: number;
  ai_keywords: string[];
  ai_reason: string | null;
  created_at: string;
}

export interface AIRecommendation {
  keywords: string[];
  reason: string;
}

export interface SearchParams {
  mood: Mood;
  budget: Budget;
  radius: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

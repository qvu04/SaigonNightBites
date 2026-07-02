export type Mood = 'tired' | 'happy' | 'date' | 'group' | 'sweet' | 'savory';
export type Budget = 'low' | 'mid' | 'high';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface UserRecord {
  id: string;
  email: string;
  password_hash?: string;
}

export interface Place {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  location: { lat: number; lng: number };
  open_now: boolean | null;
  photo_url: string | null;
  distance: number;
  ai_reason?: string | null;
}

export interface RankedPlace {
  place_id: string;
  ai_reason: string;
}

export interface ProsConsInsight {
  pros: string[];
  cons: string[];
  comments: string[];
}

export interface FavoritePlace {
  id: string;
  user_id: string;
  place_id: string;
  name: string;
  rating: number | null;
  vicinity: string | null;
  location: { lat: number; lng: number } | null;
  photo_url: string | null;
  created_at: string;
}

export interface SearchHistory {
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

export interface AddFavoriteInput {
  place_id: string;
  name: string;
  rating?: number;
  vicinity?: string;
  location?: { lat: number; lng: number };
  photo_url?: string | null;
}

export interface SaveHistoryInput {
  mood: Mood;
  budget: Budget;
  radius: number;
  ai_keywords: string[];
  ai_reason: string;
  latitude: number;
  longitude: number;
}

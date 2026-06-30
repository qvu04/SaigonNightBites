import supabase from '../config/supabase.js';
import type { SearchHistory, SaveHistoryInput } from '../types/index.js';

export async function getUserHistory(userId: string): Promise<SearchHistory[]> {
  const { data, error } = await supabase
    .from('search_history')
    .select('id, mood, budget, radius, ai_keywords, ai_reason, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return (data ?? []) as SearchHistory[];
}

export async function saveSearchHistory(
  userId: string,
  input: SaveHistoryInput
): Promise<string | null> {
  const { data, error } = await supabase
    .from('search_history')
    .insert({
      user_id: userId,
      mood: input.mood,
      budget: input.budget,
      radius: input.radius,
      ai_keywords: input.ai_keywords,
      ai_reason: input.ai_reason,
      latitude: Math.round(input.latitude * 100) / 100,
      longitude: Math.round(input.longitude * 100) / 100,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[historyService] Failed to save history:', error.message);
    return null;
  }
  return data?.id ?? null;
}

import supabase from '../config/supabase.js';
import type { FavoritePlace, AddFavoriteInput } from '../types/index.js';

export async function getUserFavorites(userId: string): Promise<FavoritePlace[]> {
  const { data, error } = await supabase
    .from('favorite_places')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addUserFavorite(
  userId: string,
  input: AddFavoriteInput
): Promise<FavoritePlace> {
  const { data, error } = await supabase
    .from('favorite_places')
    .insert({
      user_id: userId,
      place_id: input.place_id,
      name: input.name,
      rating: input.rating ?? null,
      vicinity: input.vicinity ?? null,
      location: input.location ?? null,
      photo_url: input.photo_url ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findUserFavorite(userId: string, id: string): Promise<{ id: string } | null> {
  const { data } = await supabase
    .from('favorite_places')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  return data ?? null;
}

export async function removeUserFavorite(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('favorite_places')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

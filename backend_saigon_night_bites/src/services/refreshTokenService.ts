import crypto from 'crypto';
import supabase from '../config/supabase.js';

const REFRESH_TOKEN_DAYS = 7;
// const REFRESH_TOKEN_DAYS = 1 / (24 * 60);

interface RefreshTokenRow {
  user_id: string;
  expires_at: string;
  users: { email: string } | null;
}

export async function createRefreshToken(
  userId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  const { error } = await supabase
    .from('refresh_tokens')
    .insert({ user_id: userId, token, expires_at: expiresAt.toISOString() });

  if (error) throw error;
  return { token, expiresAt };
}

/**
 * Validates token, rotates it (one-time use), returns new token pair.
 * Returns null if token is invalid or expired.
 */
export async function validateAndRotate(
  token: string
): Promise<{ userId: string; email: string; newToken: string; expiresAt: Date } | null> {
  const { data } = await supabase
    .from('refresh_tokens')
    .select('user_id, expires_at, users(email)')
    .eq('token', token)
    .single<RefreshTokenRow>();

  if (!data?.users) return null;
  if (new Date(data.expires_at) < new Date()) {
    await supabase.from('refresh_tokens').delete().eq('token', token);
    return null;
  }

  // Rotate: revoke old token, issue new one
  await supabase.from('refresh_tokens').delete().eq('token', token);
  const { token: newToken, expiresAt } = await createRefreshToken(data.user_id);

  return { userId: data.user_id, email: data.users.email, newToken, expiresAt };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await supabase.from('refresh_tokens').delete().eq('token', token);
}

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';
import type { UserRecord, JwtPayload } from '../types/index.js';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '15m';

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const { data } = await supabase
    .from('users')
    .select('id, email, password_hash')
    .eq('email', email)
    .single();
  return data ?? null;
}

export async function createUser(email: string, passwordHash: string): Promise<UserRecord> {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, password_hash: passwordHash })
    .select('id, email')
    .single();
  if (error) throw error;
  return data;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePasswords(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

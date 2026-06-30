import type { Mood, Budget } from '../types'

const BUDGET_MAP: Record<Budget, string> = {
  low: 'Dưới 50k',
  mid: '50k – 150k',
  high: 'Trên 150k',
}

const MOOD_MAP: Record<Mood, string> = {
  tired: 'Mệt mỏi 😴',
  happy: 'Vui vẻ 😄',
  date: 'Hẹn hò 💕',
  group: 'Đi nhóm 👥',
  sweet: 'Thèm ngọt 🍮',
  savory: 'Thèm mặn 🍜',
}

export function formatBudget(budget: string): string {
  return BUDGET_MAP[budget as Budget] ?? budget
}

export function formatMood(mood: string): string {
  return MOOD_MAP[mood as Mood] ?? mood
}

export function formatBudget(budget) {
  const map = {
    low: 'Dưới 50k',
    mid: '50k – 150k',
    high: 'Trên 150k',
  }
  return map[budget] || budget
}

export function formatMood(mood) {
  const map = {
    tired: 'Mệt mỏi 😴',
    happy: 'Vui vẻ 😄',
    date: 'Hẹn hò 💕',
    group: 'Đi nhóm 👥',
    sweet: 'Thèm ngọt 🍮',
    savory: 'Thèm mặn 🍜',
  }
  return map[mood] || mood
}

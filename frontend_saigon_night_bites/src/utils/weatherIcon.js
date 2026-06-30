export function getWeatherEmoji(condition) {
  if (!condition) return '🌤️'
  const c = condition.toLowerCase()
  if (c.includes('rain') || c.includes('mưa')) return '🌧️'
  if (c.includes('cloud') || c.includes('mây')) return '⛅'
  if (c.includes('clear') || c.includes('nắng')) return '☀️'
  return '🌤️'
}

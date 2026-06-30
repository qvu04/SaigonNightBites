export const formatRadiusKm = (meters: number): string => {
    return `${(meters / 1000).toFixed(0)} km`
};
export const formatTime = (ms: number): string => {
    const total = Math.max(0, Math.floor(ms / 1000))
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`
}
const DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
export const formatViDate = (dateStr: string): string => {
    const d = new Date(dateStr)
    const day = DAYS[d.getDay()]
    const date = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    return `${day}, ${date} tháng ${month} ${year}`
}
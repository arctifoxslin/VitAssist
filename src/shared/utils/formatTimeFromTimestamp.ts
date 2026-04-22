export const formatTimeFromTimestamp = (timestamp: number) => {
    const day = new Date(timestamp)
    const hh = String(day.getHours()).padStart(2, '0')
    const mm = String(day.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
}
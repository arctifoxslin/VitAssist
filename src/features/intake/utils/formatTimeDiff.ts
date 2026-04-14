export function formatTimeDiff(target: number): string {
    const now = Date.now()
    const diff = target - now
    if(diff <= 0) {
        return "сейчас"
    }

    const mm = Math.floor(diff / 60000)
    const hours = Math.floor(mm / 60)
    const minutes = mm % 60

    if(hours > 0 && minutes > 0) {
        return `через ${hours} ч ${minutes} мин`
    }
    if(hours > 0) {
        return `через ${hours} ч`
    }

    return `через ${minutes} мин`
}
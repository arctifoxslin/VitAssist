export function formatTimeDiff(target: number): string {
    const now = Date.now()
    const diff = target - now
    if (diff <= 0) {
        return "сейчас"
    }

    const totalMinutes = Math.floor(diff / 60000)
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    const parts: string[] = []

    if (days > 0) {
        parts.push(`${days} д`)
    }

    if (hours > 0) {
        parts.push(`${hours} ч`)
    }
    if (minutes > 0) {
        parts.push(`${minutes} мин`)
    }

    return parts.join(" ")
}

/*function plural(n: number, one: string, few: string, many: string) {
    const mod10 = n % 10
    const mod100 = n % 100

    if(mod10 === 1 && mod100 !== 11) {
        return one
    }

    if(mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >=20)) {
        return few
    }

    return many
}*/
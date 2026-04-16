export const REPEAT_TYPE = {
    once: 'once',
    daily: 'daily',
    everyXDays: 'everyXDays',
    weekly: 'weekly',
    monthly: 'monthly',
} as const

export type RepeatType = keyof typeof REPEAT_TYPE

export const REPEAT_TYPE_LABELS: Record<RepeatType, string> = {
    once: 'Один раз',
    daily: 'Каждый день',
    everyXDays: 'Через N дней',
    weekly: 'По дням недели',
    monthly: 'Раз в месяц',
}
export const INTAKE_STATUS_COLORS = {
    taken: "#0ab334",
    skipped: "#c11010",
    delayed: "#6e6e6e",
} as const

export type IntakeStatus = keyof typeof INTAKE_STATUS_COLORS

export const INTAKE_STATUS_ICONS: Record<IntakeStatus, string> = {
    taken: "✓",
    skipped: "✕",
    delayed: "•",
}

export const INTAKE_STATUS_TEXT: Record<IntakeStatus, string> = {
    taken: "Принято",
    skipped: "Пропущено",
    delayed: "Отложено",
}

export const INTAKE_STATUS = {
    taken: {
        color: INTAKE_STATUS_COLORS.taken,
        icon: INTAKE_STATUS_ICONS.taken,
        text: INTAKE_STATUS_TEXT.taken,
    },
    skipped: {
        color: INTAKE_STATUS_COLORS.skipped,
        icon: INTAKE_STATUS_ICONS.skipped,
        text: INTAKE_STATUS_TEXT.skipped,
    },
    delayed: {
        color: INTAKE_STATUS_COLORS.delayed,
        icon: INTAKE_STATUS_ICONS.delayed,
        text: INTAKE_STATUS_TEXT.delayed,
    },
} as const

export function getIntakeStatus(status?: IntakeStatus) {
    if (!status) return null
    return INTAKE_STATUS[status]
}
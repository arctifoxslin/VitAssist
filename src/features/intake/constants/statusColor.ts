export const INTAKE_STATUS_COLORS = {
    taken: "",
    skipped: "",
    delayed: "",
} as const

export type IntakeStatusColorKey = keyof typeof INTAKE_STATUS_COLORS

export function getIntakeStatusColor(status: IntakeStatusColorKey): string {
    return INTAKE_STATUS_COLORS[status]
}
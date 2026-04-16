export const FORM_LABELS = {
    pill: "Таблетка",
    capsule: "Капсула",
    liquid: "Жидкость",
    injection: "Инъекция",
    spray: "Спрей",
    other: "Другое",
} as const
export type FormUnitType = keyof typeof FORM_LABELS

export const UNIT_TYPE_LABELS = {
    pill: "шт",
    capsule: "шт",
    injection: "шт",
    ml: "мл",
    drops: "капли",
    spray: "пшик",
    grams: "г",
    sachet: "пакетик",
} as const
export type UnitType = keyof typeof UNIT_TYPE_LABELS

export const UNIT_TYPES_BY_FORM: Record<FormUnitType, UnitType[]> = {
    pill: ["pill"],
    capsule: ["capsule"],
    injection: ["injection"],
    liquid: ["ml", "drops"],
    spray: ["spray"],
    other: ["pill", "capsule", "ml", "drops", "spray", "grams", "sachet"],
}

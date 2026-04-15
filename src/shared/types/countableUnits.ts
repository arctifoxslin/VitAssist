import { UnitType } from "./units";

export const COUNTABLE_UNITS: UnitType[] = [
    "pill",
    "capsule",
    "sachet",
]

export function isCountableUnit(unit: UnitType): boolean {
    return COUNTABLE_UNITS.includes(unit)
}
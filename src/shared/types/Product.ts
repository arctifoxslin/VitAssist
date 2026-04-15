import { FormUnitType, UnitType } from "./units";

export interface Product {
    id: string
    name: string
    dosage: string
    form: FormUnitType
    totalUnits?: number
    remainingUnits?: number
    unitType: UnitType
    color?: string
    icon?: string
    notes?: string
    createdAt: number
    updatedAt: number
    archived?: boolean
}

export interface ProductDraft {
    name: string
    dosage: string
    form: FormUnitType
    totalUnits: number
    unitType: UnitType
    notes?: string
}

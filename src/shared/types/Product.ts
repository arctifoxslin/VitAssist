export type FormUnitTypes = 'pill' | 'capsule' | 'liquid' | 'injection' | 'other'

export interface Product {
    id: string
    name: string
    dosage: string
    form: FormUnitTypes
    totalUnits?: number
    remainingUnits: number
    unitType?: FormUnitTypes
    color?: string
    icon?: string
    notes?: string
    createdAt: number
    updatedAt: number
    archived?: boolean
}

export interface ProductDraft {
    name:string
    dosage: string
    form: FormUnitTypes
    totalUnits: number
    unitType: FormUnitTypes
    notes?: string
}
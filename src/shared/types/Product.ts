export interface Product {
    id: string
    name: string
    dosage: string
    form: 'pill' | 'capsule' | 'liquid' | 'injection' | 'other'
    totalUnits?: number
    remainingUnits?: number
    unitType?: 'pill' | 'capsule' | 'liquid' | 'injection' | 'other'
    color?: string
    icon?: string
    notes?: string
    createdAt: number
    updatedAt: number
}
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppInput } from "../../../shared/ui/AppInput";
import { AppButton } from "../../../shared/ui/AppButton";
import { ProductDraft } from "../../../shared/types/Product";
import { FormUnitType, UnitType, UNIT_TYPES_BY_FORM, FORM_LABELS, UNIT_TYPE_LABELS } from "../../../shared/types/units";
import { isCountableUnit } from "../../../shared/types/countableUnits";
import { AppSelect } from "../../../shared/ui/AppSelect";

interface Props {
    initialDraft?: ProductDraft
    onSubmit: (draft: ProductDraft) => void
}

export const ProductForm = ({
    initialDraft: initialDraft,
    onSubmit,
}: Props) => {
    const [name, setName] = useState('')
    const [dosage, setDosage] = useState('')
    const [totalUnits, setTotalUnits] = useState('')
    const [unitType, setUnitType] = useState<UnitType>('pill')
    const [form, setForm] = useState<FormUnitType>('pill')
    const [notes, setNotes] = useState('')
    const formOptions = (Object.keys(FORM_LABELS) as FormUnitType[]).map(key => ({
        label: FORM_LABELS[key],
        value: key,
    }))
    const unitOptions = UNIT_TYPES_BY_FORM[form].map(unit => ({
        label: UNIT_TYPE_LABELS[unit],
        value: unit,
    }))

    useEffect(() => {
        if (initialDraft) {
            setName(initialDraft.name)
            setDosage(initialDraft.dosage)
            setTotalUnits(initialDraft.totalUnits.toString())
            setUnitType(initialDraft.unitType)
            setForm(initialDraft.form)
            setNotes(initialDraft.notes ?? '')
        }
    }, [initialDraft])

    const isValid = () => {
        if (!name.trim()) return false
        if (!dosage.trim()) return false

        if (isCountableUnit(unitType)) {
            const units = Number(totalUnits)
            if (!units || units <= 0) return false
        }

        return true
    }

    const handleFormChange = (newForm: FormUnitType) => {
        setForm(newForm)
        setUnitType(UNIT_TYPES_BY_FORM[newForm][0])
    }

    const handleSubmit = () => {
        onSubmit({
            name,
            dosage,
            totalUnits: Number(totalUnits),
            unitType,
            form,
            notes: notes.trim() || undefined
        })
    }

    const shouldShowUnitType = !['pill', 'capsule', 'injection', 'spray'].includes(form)

    return (
        <View style={{ gap: 16 }}>

            <AppText variant='h2'>
                Название
            </AppText>
            <AppInput
                value={name}
                onChangeText={setName}
            />

            <AppText variant='h2'>
                Дозировка препарата
            </AppText>
            <AppText variant="subtitle">
                Количество активного вещества
            </AppText>
            <AppInput
                value={dosage}
                onChangeText={setDosage}
            />
            <AppText variant='h2'>
                Форма препарата
            </AppText>
            <AppSelect
                label="Физическая форма препарата"
                value={form}
                options={formOptions}
                onChange={(v) => handleFormChange(v as FormUnitType)}
            />

            {shouldShowUnitType && (
                <>
                    <AppText variant='h2'>
                        Единица разового приёма
                    </AppText>

                    <AppSelect
                        label="Единица измерения разового приёма: 2 капли, 1 таблетка, 5 мл..."
                        value={unitType}
                        options={unitOptions}
                        onChange={(v) => setUnitType(v as UnitType)}
                    />


                </>
            )}
            {isCountableUnit(unitType) && (
                <>
                    <AppText variant='h2'>
                        Количество в упаковке
                    </AppText>
                    <AppInput
                        value={totalUnits}
                        onChangeText={setTotalUnits}
                        keyboardType="numeric"
                    />
                </>
            )}

            <AppText variant='h3'>
                Примечание
            </AppText>
            <AppInput
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <AppButton
                title="Сохранить"
                variant="primary"
                onPress={handleSubmit}
                disabled={!isValid()}
            />
        </View>
    )
}
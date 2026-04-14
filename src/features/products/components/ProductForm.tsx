import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppInput } from "../../../shared/ui/AppInput";
import { AppButton } from "../../../shared/ui/AppButton";
import { FormUnitTypes, ProductDraft } from "../../../shared/types/Product";

interface Props {
    initialDraft?: ProductDraft
    onSubmit: (draft: ProductDraft) => void
}

export const ProductForm = ({ initialDraft: initialDraft, onSubmit }: Props) => {
    const [name, setName] = useState('')
    const [dosage, setDosage] = useState('')
    const [totalUnits, setTotalUnits] = useState('')
    const [unitType, setUnitType] = useState<FormUnitTypes>('pill')
    const [form, setForm] = useState<FormUnitTypes>('pill')
    const [notes, setNotes] = useState('')

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
                Дозировка
            </AppText>
            <AppInput
                value={dosage}
                onChangeText={setDosage}
            />
            <AppText variant='h2'>
                Количество
            </AppText>
            <AppInput
                value={totalUnits}
                onChangeText={setTotalUnits}
                keyboardType="numeric"
            />
            <AppText variant='h2'>
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
            />
        </View>
    )


}
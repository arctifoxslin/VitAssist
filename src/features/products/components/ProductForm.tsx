import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { FormUnitTypes, Product, ProductDraft } from "../../../shared/types/Product";

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
        if(initialDraft) {
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

    return(
        <View style={{ gap: 16 }}>
            <Text variant='titleMedium'>
                Название
            </Text>
            <TextInput
                value={name}
                onChangeText={setName}
            />
            <Text variant='titleMedium'>
                Дозировка
            </Text>
            <TextInput
                value={dosage}
                onChangeText={setDosage}
            />
            <Text variant='titleMedium'>
                Количество
            </Text>
            <TextInput
                value={totalUnits}
                onChangeText={setTotalUnits}
                keyboardType="numeric"
            />
            <Text variant='titleMedium'>
                Примечание
            </Text>
            <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <Button mode="contained" onPress={handleSubmit}>
                Сохранить
            </Button>
        </View>
    )


}
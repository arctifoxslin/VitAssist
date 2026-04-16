import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppInput } from "../../../shared/ui/AppInput";
import { AppButton } from "../../../shared/ui/AppButton";
import { ProductDraft } from "../../../shared/types/Product";
import { FormUnitType, UnitType, UNIT_TYPES_BY_FORM } from "../../../shared/types/units";
import { UnitTypeSelector } from "./UnitTypeSelector";
import { FormSelector } from "./FormSelector";
import { DropdownItem } from "../../../shared/ui/DropdownMenu";
import { isCountableUnit } from "../../../shared/types/countableUnits";

interface Props {
    initialDraft?: ProductDraft
    onSubmit: (draft: ProductDraft) => void
    openDropdown: (
        owner: 'form' | 'unitType',
        items: DropdownItem[],
        position: { x: number, y: number }
    ) => void
    dropdownOpen: boolean
    dropdownOwner: 'form' | 'unitType' | null
}

export const ProductForm = ({
    initialDraft: initialDraft,
    onSubmit,
    openDropdown,
    dropdownOpen,
    dropdownOwner,
}: Props) => {
    const [name, setName] = useState('')
    const [dosage, setDosage] = useState('')
    const [totalUnits, setTotalUnits] = useState('')
    const [unitType, setUnitType] = useState<UnitType>('pill')
    const [form, setForm] = useState<FormUnitType>('pill')
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
        <ScrollView contentContainerStyle={{ gap: 24 }}>
            <View>

                <AppText variant='h3'>
                    Название
                </AppText>
                <AppInput
                    value={name}
                    onChangeText={setName}
                />

                <AppText variant='h3'>
                    Дозировка препарата
                </AppText>
                <AppText variant="caption">
                    Количество активного вещества
                </AppText>
                <AppInput
                    value={dosage}
                    onChangeText={setDosage}
                />


                <AppText variant='h3'>
                    Форма препарата
                </AppText>
                <AppText variant="caption">
                    Физическая форма препарата
                </AppText>
                <FormSelector
                    value={form}
                    onChange={handleFormChange}
                    openDropdown={(items, position) => openDropdown('form', items, position)}
                    dropdownOpen={dropdownOpen && dropdownOwner === 'form'}
                />


                {shouldShowUnitType && (
                    <>
                        <AppText variant='h3'>
                            Единица разового приёма
                        </AppText>
                        <AppText variant="caption">
                            Единица измерения разового приёма: 2 капли, 1 таблетка, 5 мл...
                        </AppText>
                        <UnitTypeSelector
                            form={form}
                            value={unitType}
                            onChange={setUnitType}
                            openDropdown={(items, position) => openDropdown('unitType', items, position)}
                            dropdownOpen={dropdownOpen && dropdownOwner === 'unitType'}
                        />

                    </>
                )}
                {isCountableUnit(unitType) && (
                    <>
                        <AppText variant='h3'>
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
        </ScrollView>
    )
}
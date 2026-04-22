import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { AppCard } from "./AppCard";
import { Icon } from "./Icon";

interface Option {
    label: string
    value: string | number
}

interface Props {
    label?: string
    value: string | number | null
    options: Option[]
    onChange: (value: string | number) => void
    placeholder?: string
}

export const AppSelect = ({
    label,
    value,
    options,
    onChange,
    placeholder = "Выберите значение",
}: Props) => {
    const [open, setOpen] = useState(false)

    const selected = options.find(o => o.value === value)

    return (
        <View style={{ marginBottom: 8 }}>
            {label && (
                <AppText style={{ marginBottom: 4 }}>
                    {label}
                </AppText>
            )}

            <Pressable onPress={() => setOpen(o => !o)}>
                <AppCard style={styles.field}>
                    <AppText style={{ opacity: selected ? 1 : 0.6 }}>
                        {selected ? selected.label : placeholder}
                    </AppText>
                    <Icon
                        name={open ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#555"
                    />
                </AppCard>
            </Pressable>

            {open && (
                <View style={styles.dropdown}>
                    {options.map(opt => (
                        <Pressable
                            key={String(opt.value)}
                            onPress={() => {
                                onChange(opt.value)
                                setOpen(false)
                            }}
                        >
                            <View style={styles.option}>
                                <AppText>{opt.label}</AppText>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    field: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    dropdown: {
        marginTop: 4,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        elevation: 2,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E0E0E0",
    },
})

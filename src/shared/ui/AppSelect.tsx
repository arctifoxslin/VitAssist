import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { AppCard } from "./AppCard";
import { Icon } from "./Icon";
import { COLORS } from "./theme/colors";

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
        <View style={styles.container}>
            {label && (
                <AppText variant="subtitle">
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
    container: {
        width: '100%',
        gap: 6,
    },
    field: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dropdown: {
        marginTop: 6,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: COLORS.surface,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    option: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },
})

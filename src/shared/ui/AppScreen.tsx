import React from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "./theme/colors"

interface Props {
    children: React.ReactNode
    style?: any
    scroll?: boolean
}

export const AppScreen = ({ children, style, scroll = false }: Props) => {
    if (scroll) {
        return (
            <View style={[styles.content, style]}>
                <ScrollView
                    contentContainerStyle={{ padding: 16, gap: 12 }}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={[styles.content, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
    },
})

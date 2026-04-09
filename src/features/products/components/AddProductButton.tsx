import React from "react";
import { FAB } from "react-native-paper";

interface Props {
    onPress: () => void
}

export const AddProductButton = ({ onPress }: Props) => {
    return (
        <FAB
            icon="plus"
            style={{
                position: "absolute",
                bottom: 24,
                right: 24,
            }}
            onPress={onPress}
        />
    )
}
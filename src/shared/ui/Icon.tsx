import React from "react";
import Feather from "react-native-vector-icons/Feather";

export type IconName = "plus" | "user" | "menu" | "settings" | "x" | "arrow-down-right"

interface Props {
    name: IconName
    size?: number
    color?: string
}

export const Icon = ({ name, size = 24, color = "black" }: Props) => {
    return <Feather name={name} size={size} color={color} />
}
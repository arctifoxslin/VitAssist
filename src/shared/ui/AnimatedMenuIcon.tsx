import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Icon, IconName } from "./Icon";
interface Props {
    open: boolean
    size?: number
    color?: string
}

export const AnimatedMenuIcon = ({ open, size = 22, color = "#000" }: Props) => {
    const rotate = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 80,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }),
            Animated.timing(rotate, {
                toValue: open ? 1 : 0,
                duration: 160,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }),
        ]).start(() => {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            }).start()
        })
    }, [open])

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    })

    const iconName: IconName = open ? "chevron-up" : "chevron-down"

    return (
        <Animated.View style={{
            transform: [{ rotate: rotation }],
            opacity
        }}>
            <Icon name={iconName} size={size} color={color} />
        </Animated.View>
    )
}
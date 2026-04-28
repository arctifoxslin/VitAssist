import React, { useEffect, useRef } from "react";
import { View, Pressable, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppText } from "../../shared/ui/AppText";
import { Icon } from "../../shared/ui/Icon";
import { AppNavigationStack } from "../../app/navigation/AppNavigationStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MENU_ITEMS } from "./menuItems";

export type AppNavigation = NativeStackNavigationProp<AppNavigationStack>

interface Props {
    menuOpen: boolean
    setMenuOpen: (v: boolean) => void
}

export const LeftSideBar = ({ menuOpen, setMenuOpen }: Props) => {
    const navigation = useNavigation<AppNavigation>()
    const screenWidth = Dimensions.get("window").width
    const maxWidth = screenWidth * 0.8

    const slideX = useRef(new Animated.Value(-screenWidth)).current

    useEffect(() => {
        Animated.timing(slideX, {
            toValue: menuOpen ? 0 : -screenWidth,
            duration: 350,
            useNativeDriver: true,
        }).start()
    }, [menuOpen, slideX, screenWidth])
    return (
        <>
            {menuOpen && (
                <Pressable
                    onPress={() => setMenuOpen(false)}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 40,
                    }}
                />
            )}
            <Animated.View style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                minWidth: 260,
                maxWidth: maxWidth,
                backgroundColor: "#eee",
                padding: 16,
                justifyContent: "space-between",
                elevation: 8,
                zIndex: 50,
                transform: [{ translateX: slideX }],
            }}>
                <View style={{ gap: 24 }}>
                    <Icon name="user" size={28} />
                    {MENU_ITEMS.map((item) =>
                    (
                        <Pressable
                            key={item.label}
                            onPress={() => {
                                navigation.navigate(item.route.name as any, item.route.params)
                                setMenuOpen(false)
                            }}
                        >
                            <AppText variant="h3">
                                {item.label}
                            </AppText>
                        </Pressable>
                    )
                    )}
                    {/*<Pressable
                        onPress={() => {
                            navigation.navigate("ScheduleNavigationMap")
                            setMenuOpen(false)
                        }}
                    >
                        <AppText variant='h2'>
                            Расписания
                        </AppText>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            navigation.navigate("ProductsNavigationMap", {
                                screen: "ProductsList"
                            })
                            setMenuOpen(false)
                        }}
                    >
                        <AppText variant='h2'>
                            Препараты
                        </AppText>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            navigation.navigate("ProductsNavigationMap", {
                                screen: "ArchivedProducts"
                            })
                            setMenuOpen(false)
                        }}
                    >
                        <AppText variant='h2'>
                            Архив препаратов
                        </AppText>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            navigation.navigate("IntakeNavigationMap", {
                                screen: "HistoryScreen"
                            })
                            setMenuOpen(false)
                        }}
                    >
                        <AppText variant='h2'>
                            История приёмов
                        </AppText>
                    </Pressable>
                    */}
                </View>
                <Icon name="settings" size={26} />
            </Animated.View>
        </>
    )
}
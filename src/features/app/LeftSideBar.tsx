import React from "react";
import { View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppText } from "../../shared/ui/AppText";
import { Icon } from "../../shared/ui/Icon";
import { AppNavigationStack } from "../../app/navigation/AppNavigationStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AppNavigation = NativeStackNavigationProp<AppNavigationStack>

interface Props {
    menuOpen: boolean
    setMenuOpen: (v: boolean) => void
}

export const LeftSideBar = ({ menuOpen, setMenuOpen }: Props) => {
    const navigation = useNavigation<AppNavigation>()
    return (
        <>
            {menuOpen && (
                <View style={{
                    position: "absolute",
                    left: 40,
                    top: 0,
                    bottom: 0,
                    width: 220,
                    backgroundColor: "#eee",
                    padding: 16,
                    justifyContent: "space-between",
                    elevation: 8,
                    zIndex: 30,
                }}>
                    <View style={{ gap: 24 }}>
                        <Icon name="user" size={28} />
                        <Pressable
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
                    </View>
                    <Icon name="settings" size={26} />
                </View>
            )}

        </>
    )
}
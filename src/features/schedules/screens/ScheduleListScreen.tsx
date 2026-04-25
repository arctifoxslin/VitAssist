import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { ScheduleCard } from "../components/ScheduleCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "../SchedulesNavigationStack";
import { useNavigation } from "@react-navigation/native";
import { Fab } from "../../../shared/ui/PlusButton";
import { AppScreen } from "../../../shared/ui/AppScreen";

type Navigation = NativeStackNavigationProp<SchedulesNavigationStack, 'ScheduleList'>

export const ScheduleListScreen = () => {
    const navigation = useNavigation<Navigation>()
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Все расписания"
        })
    }, [])
    const schedules = useSelector(
        (state: RootState) => state.schedules.list
    )

    /*Global tik*/
    const [now, setNow] = useState(Date.now())
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now())
        }, 60_000)
        return () => clearInterval(interval)
    }, [])

    return (
        <AppScreen>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => (
                    <ScheduleCard
                        schedule={item}
                        now={now}
                        onPress={() => navigation.navigate('AddSchedule', { id: item.id })}
                    />
                )}
            />

            <Fab
                icon="plus"
                onPress={() => navigation.navigate('AddSchedule', {})}
            />
        </AppScreen>
    )
}
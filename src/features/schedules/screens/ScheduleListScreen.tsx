import React from "react";
import { View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { ScheduleCard } from "../components/ScheduleCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "../SchedulesNavigationStack";
import { useNavigation } from "@react-navigation/native";
import { Fab } from "../../../shared/ui/Fab";

type Navigation = NativeStackNavigationProp<SchedulesNavigationStack, 'ScheduleList'>

export const ScheduleListScreen = () => {
    const navigation = useNavigation<Navigation>()
    const schedules = useSelector(
        (state: RootState) => state.schedules.list
    )

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => (
                    <ScheduleCard
                        schedule={item}
                        onPress={() => navigation.navigate('AddSchedule', { id: item.id })}
                    />
                )}
            />

            <Fab
                icon="plus"
                onPress={() => navigation.navigate('AddSchedule', {})}
            />
        </View>
    )
}
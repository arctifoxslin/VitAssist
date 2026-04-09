import React from "react";
import { View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { ScheduleCard } from "../components/ScheduleCard";
import { FAB } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "../SchedulesNavigationStack";

type Props = NativeStackScreenProps<SchedulesNavigationStack, 'ScheduleList'>

export const ScheduleListScreen = ({ navigation }: Props) => {

    const schedules = useSelector(
        (state: RootState) => state.schedules.list
    )

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({item}) => (
                    <ScheduleCard
                        schedule={item}
                        onPress={() => navigation.navigate('AddSchedule', {id: item.id})}
                    />
                )}
            />

            <FAB
                icon="plus"
                style={{
                    position: "absolute",
                    bottom: 24,
                    right: 24,
                }}
                onPress={() => navigation.navigate('AddSchedule', {})}
            />
        </View>
    )
}
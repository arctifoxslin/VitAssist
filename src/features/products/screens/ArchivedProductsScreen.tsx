import React from "react";
import { View, FlatList } from "react-native";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { Button, Text } from "react-native-paper";
import { RootState } from "../../../app/store/store";
import { unarchiveProduct } from "../productsSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";


type Props = NativeStackScreenProps<ProductsNavigationStack, 'ArchivedProducts'>

export const ArchivedProductsScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch()

    const archivedProducts = useSelector((state: RootState) => 
        state.products.list.filter(p => p.archived)
    )
    const handleUnarchive = (id: string) => {
        dispatch(unarchiveProduct(id))
    }

    if(archivedProducts.length === 0){
        return (
            <View style={{ padding: 16 }}>
                <Text variant='bodyLarge'>
                    Архив пуст
                </Text>
            </View>
        )
    }
    return (
        <FlatList
            contentContainerStyle={{ padding: 16, gap: 16 }}
            data={archivedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <View style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: "#f2f2f2",
                    gap: 8
                }}>
                    <Text variant='titleMedium'>
                        {item.name}
                    </Text>
                    {item.notes && (
                        <Text variant='bodyMedium' style={{ opacity: 0.7 }}>
                            {item.notes}
                        </Text>
                    )}

                    <Button
                        mode='contained-tonal'
                        onPress={() => handleUnarchive(item.id)}
                    >
                        Вернуть в список
                    </Button>
                </View>  
            )}
        />
    )
}
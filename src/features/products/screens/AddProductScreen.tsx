import React from "react";
import { View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, archiveProduct } from "../productsSlice";
import { Product, ProductDraft } from "../../../shared/types/Product";
import { ProductForm } from "../components/ProductForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { RootState } from "../../../app/store/store";
import uuid from "react-native-uuid";

type Props = NativeStackScreenProps<ProductsNavigationStack, 'AddProduct'>

export const AddProductScreen = ({ navigation, route }: Props) => {
    const dispatch = useDispatch()

    const editId = route.params?.id

    const existProduct = useSelector((state: RootState) =>
        state.products.list.find((p) => p.id === editId)
    )

    const initialDraft: ProductDraft | undefined = existProduct ? {
        name: existProduct.name,
        dosage: existProduct.dosage,
        totalUnits: existProduct.totalUnits ?? 0,
        form: existProduct.form,
        unitType: existProduct.unitType ?? existProduct.form,
        notes: existProduct.notes,
    } : undefined

    const handleSubmit = (draft: ProductDraft) => {
        const product: Product = {
            ...draft,
            id: editId ?? uuid.v4().toString(),
            remainingUnits: existProduct?.remainingUnits ?? draft.totalUnits,
            archived: existProduct?.archived ?? false,
            createdAt: existProduct?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        }

        if (existProduct) {
            dispatch(updateProduct(product))
        } else {
            dispatch(addProduct(product))
        }

        navigation.goBack()
    }

    const handleArchive = () => {
        if (!editId) {
            return
        }
        dispatch(archiveProduct(editId))
        navigation.goBack()
    }

    return (
        <View style={{ padding: 16 }}>
            <ProductForm initialDraft={initialDraft} onSubmit={handleSubmit} />

            {editId && (
                <AppButton
                    title="Архивировать"
                    variant='primary'
                    onPress={handleArchive}
                />
            )}
        </View>
    )
}
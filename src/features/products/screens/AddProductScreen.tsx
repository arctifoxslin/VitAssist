import React, { useLayoutEffect } from "react";
import { AppButton } from "../../../shared/ui/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { archiveProduct, createProductThunk, updateProductThunk } from "../productsSlice";
import { Product, ProductDraft } from "../../../shared/types/Product";
import { UNIT_TYPES_BY_FORM } from "../../../shared/types/units";
import { ProductForm } from "../components/ProductForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { AppDispatch } from "../../../app/store/store";
import uuid from "react-native-uuid";
import { selectActiveProducts } from "../productsSelectors";
import { isCountableUnit } from "../../../shared/types/countableUnits";
import { AppScreen } from "../../../shared/ui/AppScreen";

type Props = NativeStackScreenProps<ProductsNavigationStack, 'AddProduct'>

export const AddProductScreen = ({ navigation, route }: Props) => {
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Новый препарат"
        })
    }, [navigation])

    const dispatch = useDispatch<AppDispatch>()

    const editId = route.params?.id

    const products = useSelector(selectActiveProducts)
    const existProduct = products.find((p) => p.id === editId)

    const initialDraft: ProductDraft | undefined = existProduct ? {
        name: existProduct.name,
        dosage: existProduct.dosage,
        totalUnits: isCountableUnit(existProduct.unitType)
            ? existProduct.totalUnits ?? 0
            : 0,
        form: existProduct.form,
        unitType: existProduct.unitType ?? UNIT_TYPES_BY_FORM[existProduct.form][0],
        notes: existProduct.notes,
    } : undefined

    const handleSubmit = (draft: ProductDraft) => {
        const product: Product = {
            ...draft,
            id: editId ?? uuid.v4().toString(),
            remainingUnits: isCountableUnit(draft.unitType)
                ? (existProduct?.remainingUnits ?? draft.totalUnits)
                : undefined,
            archived: existProduct?.archived ?? false,
            createdAt: existProduct?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        }

        if (existProduct) {
            dispatch(updateProductThunk(product))
        } else {
            dispatch(createProductThunk(product))
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
        <>
            <AppScreen scroll>
                <ProductForm
                    initialDraft={initialDraft}
                    onSubmit={handleSubmit}
                />

                {editId && (
                    <AppButton
                        title="Архивировать"
                        variant="danger"
                        onPress={handleArchive}
                    />
                )}
            </AppScreen>
        </>
    )
}
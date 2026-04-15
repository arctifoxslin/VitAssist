import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, archiveProduct } from "../productsSlice";
import { Product, ProductDraft } from "../../../shared/types/Product";
import { UNIT_TYPES_BY_FORM } from "../../../shared/types/units";
import { ProductForm } from "../components/ProductForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { RootState } from "../../../app/store/store";
import uuid from "react-native-uuid";
import { DropdownMenu, DropdownItem } from "../../../shared/ui/DropdownMenu";
import { selectActiveProducts } from "../productsSelectors";
import { isCountableUnit } from "../../../shared/types/countableUnits";

type Props = NativeStackScreenProps<ProductsNavigationStack, 'AddProduct'>

export const AddProductScreen = ({ navigation, route }: Props) => {
    const dispatch = useDispatch()

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

    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([])
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
    const [dropdownOwner, setDropdownOwner] = useState<null | 'form' | 'unitType'>(null)

    const openDropdown = (
        owner: 'form' | 'unitType',
        items: DropdownItem[],
        position: { x: number, y: number }
    ) => {
        setDropdownOwner(owner)
        setDropdownItems(items)
        setDropdownPosition(position)
        setDropdownVisible(true)
    }

    const closeDropdown = () => {
        setDropdownVisible(false)
        setDropdownOwner(null)
    }

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
        <>
            <ScrollView contentContainerStyle={{ padding: 32, gap: 24 }}>
                <ProductForm
                    initialDraft={initialDraft}
                    onSubmit={handleSubmit}
                    openDropdown={openDropdown}
                    dropdownOpen={dropdownVisible}
                    dropdownOwner={dropdownOwner}
                />

                {editId && (
                    <AppButton
                        title="Архивировать"
                        variant="danger"
                        onPress={handleArchive}
                    />
                )}
            </ScrollView>


            <DropdownMenu
                visible={dropdownVisible}
                items={dropdownItems}
                position={dropdownPosition}
                onClose={closeDropdown}
            />
        </>
    )
}
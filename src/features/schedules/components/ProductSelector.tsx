import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { Menu, Button } from "react-native-paper";

interface Props {
    value: string | null
    onChange: (productId: string) => void
}

export const ProductSelector = ({ value, onChange }: Props) => {
    const products = useSelector((state: RootState) => state.products.list)
    const [visible, setVisible] = useState(false)

    const selected = products.find(p => p.id === value)

    return (
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
                <Button
                    mode='outlined'
                    onPress={() => setVisible(true)}
                >
                    {selected? selected.name : 'Выберите препарат'}
                </Button>
            }
        >
            {products.map(p => (
                <Menu.Item
                    key={p.id}
                    onPress={() => {
                        onChange(p.id)
                        setVisible(false)
                    }}
                    title={p.name}
                />
            ))}
        </Menu>
    )
}
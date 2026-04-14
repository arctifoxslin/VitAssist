import React from "react";
import { Fab } from "../../../shared/ui/Fab";

interface Props {
    onPress: () => void
}

export const AddProductButton = ({ onPress }: Props) => {
    return (
        <Fab
            icon="plus"
            onPress={onPress}
        />
    )
}
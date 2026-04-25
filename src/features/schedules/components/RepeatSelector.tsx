import React from "react";
import { AppRadioGroup } from "../../../shared/ui/AppRadioGroup";
import { RepeatType, REPEAT_TYPE, REPEAT_TYPE_LABELS } from "../../../shared/types/repeatType";

interface Props {
    value: RepeatType
    onChange: (type: RepeatType) => void
}

export const RepeatSelector = ({ value, onChange }: Props) => {
    const options = (Object.keys(REPEAT_TYPE) as RepeatType[]).map(key => ({
        label: REPEAT_TYPE_LABELS[key],
        value: REPEAT_TYPE[key],
    }))
    return (
        <AppRadioGroup
            value={value}
            onChange={(val) => onChange(val as RepeatType)}
            options={options}
        />
    )
}
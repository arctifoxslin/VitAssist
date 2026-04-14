import React from "react";
import { AppRadioGroup } from "../../../shared/ui/AppRadioGroup";
import { RepeatType } from "../../../shared/types/Schedule";

interface Props {
    value: RepeatType
    onChange: (type: RepeatType) => void
}

export const RepeatSelector = ({ value, onChange }: Props) => {
    return (
        <AppRadioGroup
            value={value}
            onChange={(value) => onChange(value as RepeatType)}
            options={[
                { label: "Один раз", value: "once" },
                { label: "Каждый день", value: "daily" },
                { label: "Через N дней", value: "every_x_days" },
                { label: "По дням недели", value: "weekly" },
                { label: "Раз в месяц", value: "monthly" },
            ]}
        />
    )
}
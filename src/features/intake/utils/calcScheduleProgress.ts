import { Intake } from "../../../shared/types/Intake";

export function calcScheduleProgress(intakes: Intake[]) {
    if (intakes.length === 0) {
        return 0
    }

    const completed = intakes.filter(i => i.status === "taken").length

    const progress = Math.round((completed / intakes.length) * 100)

    return progress
}
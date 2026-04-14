function isSameDay(intakeDay: number, scheduleDate: Date): boolean {
    const exitValue = new Date(intakeDay)
    return (
        exitValue.getFullYear() === scheduleDate.getFullYear() &&
        exitValue.getMonth() === scheduleDate.getMonth() &&
        exitValue.getDate() === scheduleDate.getDate()
    )
}
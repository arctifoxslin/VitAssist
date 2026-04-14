export const generateNotificationId = (
    type: string,
    scheduleId: string,
    time: string
) => {
    return `${type}-${scheduleId}-${time}`
}
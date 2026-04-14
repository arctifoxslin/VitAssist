let locked = false
export const lockModal = () => {
    locked = true
}

export const unlockModal = () => {
    locked = false
}

export const isModalLocked = () => locked
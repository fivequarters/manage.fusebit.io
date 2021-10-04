import { useCallback, useState } from "react"

type UseModalData = [open: boolean, setOpen: (open: boolean) => void, toogle: () => void]

export const useModal = (defaultOpen?: boolean): UseModalData => {
    const [open, setOpen] = useState(!!defaultOpen)

    const toggle = useCallback(() => setOpen(!open), [open])

    return [open, setOpen, toggle]
}
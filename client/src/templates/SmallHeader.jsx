import { Text } from "@mantine/core"
import { useEffect, useState } from "react"

export default function SmallHeader({ title }) {
    const [show, setShow] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    const handleScroll = () => {
        setShow(lastScrollY > window.scrollY)
        setLastScrollY(window.scrollY)
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    })

    return (
        <div className={`small-header ${!show && "hide"}`}>
            {typeof title === "string" ? <Text p="sm" fw={600}>{title}</Text> : title}
        </div>
    )
}
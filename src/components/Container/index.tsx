import React from "react"
import clsx from "clsx"
import { ContainerProps } from "@/types"

export default function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={clsx(
                "w-full max-w-[1200px] mx-auto box-border px-4 lg:px-0",
                className
            )}
        >
            {children}
        </div>
    )
}

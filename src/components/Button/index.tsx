import * as React from "react"
import { Button as ShadButton } from "@/components/ui/button"
import { ButtonProps  } from "@/types"
import clsx from "clsx"
import Spinner from "../Spinner"

export default function Button({
    title,
    className,
    loading = false,
    disabled = false,
    spinnerPosition = "left",
    type = "button",
    onClick,
}: ButtonProps) {
    const isCentered = spinnerPosition === "center"

    return (
        <ShadButton
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={clsx(
                // 🔹 estilos default (os que você passou)
                "relative inline-flex items-center justify-center gap-2 font-semibold text-[15px] " +
                "px-[100px] py-[17px] max-w-[385px] rounded-[40px] border-0 cursor-pointer " +
                "bg-[var(--pink-strong)] text-[var(--white)] " +
                "transition-colors transition-opacity transition-transform duration-200 ease-in-out " +
                "hover:bg-[var(--pink-strong-hover)] " +
                "disabled:opacity-70 disabled:cursor-not-allowed",
                loading && "pointer-events-none",
                className
            )}
        >
            {/* Spinner à ESQUERDA */}
            {loading && spinnerPosition === "left" && <Spinner />}

            {/* Label (se o spinner for central, mantemos layout estável) */}
            <span className={clsx(isCentered && loading && "opacity-0")}>{title}</span>

            {/* Spinner à DIREITA */}
            {loading && spinnerPosition === "right" && <Spinner />}

            {/* Spinner ao CENTRO (overlay, não desloca layout) */}
            {loading && isCentered && (
                <span
                    className="
            absolute inset-0 flex items-center justify-center
          "
                >
                    <Spinner />
                </span>
            )}
        </ShadButton>
    )
}

type SpinnerPosition = "left" | "right" | "center"

export interface ButtonProps {
    loading?: boolean
    disabled?: boolean
    spinnerPosition?: SpinnerPosition
    type?: "button" | "submit" | "reset"
    onClick?: () => void
    className?: string
    title: string
}

export interface ContainerProps {
    children: React.ReactNode
    className?: string
}

export interface BackHeaderProps {
    title: string;
}
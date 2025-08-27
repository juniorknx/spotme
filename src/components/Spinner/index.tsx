interface SpinnerProps {
    size?: 'small' | 'medium' | 'large'
    color?: string
    fullScreen?: boolean
}

export default function Spinner({
    size = 'medium',
    color = '#ffffff',
    fullScreen = false,
}: SpinnerProps) {
    const sizeClass =
        size === 'small'
            ? 'w-4 h-4'
            : size === 'large'
                ? 'w-[72px] h-[72px]'
                : 'w-12 h-12'

    const borderWidth = size === 'small' ? 'border-[2.5px]' : 'border-[5px]'

    return (
        <div
            className={fullScreen ? 'fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center' : ''}
        >
            <span
                className={`inline-block animate-spin rounded-full border-current border-r-transparent ${sizeClass} ${borderWidth}`}
                style={{ color }}
                aria-hidden="true"
            />
        </div>
    )
}

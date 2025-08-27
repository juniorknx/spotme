import React from 'react'

interface ProgressStepsProps {
    step: number
    total?: number
}

export default function ProgressSteps({ step, total = 3 }: ProgressStepsProps) {
    const percentage = (step / total) * 100

    return (
        <div className='w-full my-4'>
            <div className='flex justify-end mb-1'>
                <span className='text-[13px] text-gray-700'>{step}/{total}</span>
            </div>
            <div className='w-full h-2 bg-[var(--white-bg)] rounded-full'>
                <div
                    className='h-full bg-[var(--pink-strong)] rounded-full transition-all duration-300'
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}


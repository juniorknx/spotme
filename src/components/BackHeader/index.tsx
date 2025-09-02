import { BackHeaderProps } from '@/types';
import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/router'

export default function BackHeader({ title, fallbackHref = '/' }: BackHeaderProps) {
    const router = useRouter()

    function handleBack() {
        try {
            const hasHistory = typeof window !== 'undefined' && window.history.length > 1
            const referrer = typeof document !== 'undefined' ? document.referrer : ''
            const isInternalReferrer = !!referrer && new URL(referrer).origin === window.location.origin

            if (hasHistory && isInternalReferrer) {
                router.back()
                return
            }
        } catch (_) {
            // Ignora e segue para o fallback
        }
        router.push(fallbackHref)
    }

    return (
        <div className="grid grid-cols-3 items-center w-full bg-[var(--pink-medium)] p-7 rounded-b-3xl">
            <button onClick={handleBack} className="bg-amber-50 p-2 rounded-[9px] hover:bg-[#ffffffea] duration-300 justify-self-start">
                <IoIosArrowBack size={22} color="#000" />
            </button>

            <h2 className=" text-[19px] lg:text-2xl text-amber-50 font-semibold text-center">
                {title}
            </h2>
            <div></div>
        </div>
    )
}

import { BackHeaderProps } from '@/types';
import React from 'react'
import { IoIosArrowBack } from "react-icons/io";

export default function BackHeader({ title }: BackHeaderProps) {
    return (
        <div className="grid grid-cols-3 items-center w-full bg-[var(--pink-medium)] p-7 rounded-b-3xl">
            <button onClick={() => history.back()} className="bg-amber-50 p-2 rounded-[9px] hover:bg-[#ffffffea] duration-300 justify-self-start">
                <IoIosArrowBack size={22} color="#000" />
            </button>

            <h2 className="text-2xl text-amber-50 font-semibold text-center">
                {title}
            </h2>
            <div></div>
        </div>
    )
}

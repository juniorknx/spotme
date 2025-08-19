import BackHeader from '@/components/BackHeader'
import Container from '@/components/Container'
import React, { useState } from 'react'
import logo from '../../../public/spotme_logo.png'
import Button from '@/components/Button'
import Image from 'next/image'
import { GoHeart } from "react-icons/go";
import { IoPeopleOutline } from "react-icons/io5";
import { Input } from '@/components/ui/input'
import { formatDate } from '@/helpers/formatDate'
/* 

INPUTS
 nome e sobrenome
 whatsapp
 idade (date)
 genero
 interesses
 descricao

 PASSO 2 
 upload de fotos max 3 imagens

STEP 3
email
senha
confirma senha

*/

export default function Cadastre() {
    const [birthdate, setBirthdate] = useState("");
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <>
            <BackHeader title='Cadastre-se' />
            <Container>
                <div className='lg:flex lg:justify-center lg:h-200 lg:items-center h-140 flex justify-center items-center'>
                    <form className='w-100'>
                        <div className='flex flex-col'>
                            <div className='flex flex-col items-center justify-center gap-0.5'>
                                <div>
                                    <Image
                                        src={logo}
                                        alt='SpotMe'
                                        className='w-35 h-35 lg:w-60 lg:h-60'
                                    />
                                </div>

                                <div className='m-0.3'>
                                    <h3 className='text-[16px] text-gray-700'>Conecte-se com pessoas</h3>
                                </div>

                                <div className='flex gap-3'>
                                    <div className='flex flex-row items-center gap-1'>
                                        <GoHeart size={18} color='#FF0661' />
                                        <span className='text-[13px] text-gray-700'>Encontros reais</span>
                                    </div>

                                    <div className='flex flex-row items-center gap-1'>
                                        <IoPeopleOutline size={18} color='#FF0661' />
                                        <span className='text-[13px] text-gray-700'>Mesmo Local</span>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <div className='m-2'>
                                    <Input
                                        type="text"
                                        placeholder="Nome e Sobrenome"
                                        className="h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                <div className='m-2'>
                                    <Input
                                        type="text"
                                        placeholder="Telefone/WhatsApp"
                                        className="h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                <div className='m-2'>
                                    <Input
                                        type="text"
                                        placeholder="Data de Nascimento"
                                        maxLength={10}
                                        value={birthdate}
                                        onChange={(e) => setBirthdate(formatDate(e.target.value))}
                                        className="h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                <div className="m-2 flex gap-5 mt-4">
                                    {["Masculino", "Feminino", "Outro"].map((label) => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => setSelected(label)}
                                            className={`
                                                px-3 py-1 rounded-lg border transition-colors duration-200 text-sm
                                                border-[var(--pink-strong)]
                                                ${selected === label
                                                    ? "bg-[var(--pink-strong)] text-white"
                                                    : "bg-transparent text-black hover:bg-[var(--pink-strong)]/10"}
                                                `}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className='flex justify-center mt-3'>
                                    <Button className='w-full' title='Cadastrar' />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    )
}
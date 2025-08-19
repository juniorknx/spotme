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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
/* 

PASSO 1 
 nome e sobrenome 
 whatsapp
 idade (date)
 genero
 interesses
 descricao

 PASSO 2 
 upload de fotos max 3 imagens

PASSO 3 finaliza cadastro
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
                                        className="text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                <div className='m-2'>
                                    <Input
                                        type="text"
                                        placeholder="Telefone/WhatsApp"
                                        className="text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                <div className='m-2'>
                                    <Input
                                        type="text"
                                        placeholder="Data de Nascimento"
                                        maxLength={10}
                                        value={birthdate}
                                        onChange={(e) => setBirthdate(formatDate(e.target.value))}
                                        className="text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                <div className="m-2">
                                    <Select>
                                        <SelectTrigger
                                            className="
                                                w-full h-[50px] border-[var(--border-input)]
                                                px-4 text-sm text-gray-700 bg-white
                                                transition-colors duration-200 ease-in-out
                                                focus:outline-none
                                                focus:border-[var(--pink-strong)]
                                                focus:ring-1 focus:ring-[var(--pink-strong)] focus:ring-offset-0.2
                                                data-[state=open]:border-[var(--pink-strong)]
                                                data-[state=open]:ring-1 data-[state=open]:ring-[var(--pink-strong)] data-[state=open]:ring-offset-0.2
                                            "
                                        >
                                            <SelectValue placeholder="Gênero" />
                                        </SelectTrigger>

                                        <SelectContent className="z-50 rounded-lg border border-[var(--border-input)] bg-white shadow-md">
                                            <SelectItem value="male" className="text-sm">Masculino</SelectItem>
                                            <SelectItem value="female" className="text-sm">Feminino</SelectItem>
                                            <SelectItem value="other" className="text-sm">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='m-2'>
                                    <Textarea
                                        placeholder="Sobre você"
                                        className="text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out" />
                                </div>

                                <div className="m-2 flex gap-2 mt-4 flex-col">
                                    <h2 className='text-[14.5px] text-gray-700'>Interesses</h2>
                                    <div className='flex flex-row gap-4 flex-wrap'>
                                        {["Relacionamento Sério 💍", "Novas Amizades 🤝", "Encontros Casuais 😏", "Só Observando 👀"].map((label) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => setSelected(label)}
                                                className={`
                                                py-2 px-3 rounded-3xl border transition-colors duration-200 text-sm 
                                                border-[var(--gray)]
                                                ${selected === label
                                                        ? "bg-[#bdbdbd] text-[#000]"
                                                        : "bg-transparent text-black hover:bg-[var(--pink-strong)]/10"}
                                                `}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
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
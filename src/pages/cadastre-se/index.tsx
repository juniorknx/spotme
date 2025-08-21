import BackHeader from '@/components/BackHeader'
import Container from '@/components/Container'
import React, { useState } from 'react'
import logo from '../../../public/spotme_logo.png'
import Button from '@/components/Button'
import Image from 'next/image'
import { GoHeart } from "react-icons/go"
import { IoPeopleOutline } from "react-icons/io5"
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
import toast from "react-hot-toast"
import axios from 'axios'
import { toBase64 } from '@/helpers/formatImage' // mantido

export default function Cadastre() {
    const [step, setStep] = useState(1)
    const [birthdate, setBirthdate] = useState("")
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)
    const [about, setAbout] = useState("")
    const [gender, setGender] = useState("")
    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
    const [photoURLs, setPhotoURLs] = useState<string[]>([])

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // === Somente cria preview/local, sem subir nada aqui ===
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || [])
        if (photos.length + newFiles.length > 3) {
            toast.error('Você só pode enviar até 3 fotos.')
            return
        }

        const filesWithPreview = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setPhotos(prev => [...prev, ...filesWithPreview])
    }

    const handleRemovePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index))
        setPhotoURLs(prev => prev.filter((_, i) => i !== index)) // caso já tenha sido preenchido em algum fluxo
    }

    // ==== Helpers chamados apenas no SUBMIT ====
    async function getSignature() {
        const res = await fetch('/api/cloudinary-sign', { method: 'POST' })
        if (!res.ok) throw new Error('Falha ao obter assinatura do Cloudinary')
        return res.json() as Promise<{
            timestamp: number
            signature: string
            cloudName: string
            apiKey: string
            uploadPreset?: string
        }>
    }

    async function uploadImage(file: File): Promise<string> {
        const { timestamp, signature, cloudName, apiKey, uploadPreset } = await getSignature()

        const form = new FormData()
        form.append('file', file)
        form.append('api_key', apiKey)
        form.append('timestamp', String(timestamp))
        form.append('signature', signature)
        if (uploadPreset) form.append('upload_preset', uploadPreset)

        const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: form,
        })
        const data = await upRes.json()
        if (!upRes.ok || !data?.secure_url) {
            throw new Error(data?.error?.message || 'Falha no upload Cloudinary')
        }
        return data.secure_url as string
    }

    async function uploadAllSelectedPhotos(files: { file: File }[]): Promise<string[]> {
        const urls: string[] = []
        for (const item of files) {
            const url = await uploadImage(item.file)
            urls.push(url)
        }
        return urls
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone || !birthdate || !gender || !selected || photos.length === 0) {
            toast.error("Preencha todos os campos obrigatórios.")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem.")
            return
        }

        try {
            setLoading(true)
            const toastId = toast.loading('Enviando fotos...')

            // >>> SOMENTE AQUI as fotos são enviadas ao Cloudinary
            const urls = await uploadAllSelectedPhotos(photos)
            setPhotoURLs(urls)

            toast.success('Fotos enviadas!', { id: toastId })

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.phone,
                birthdate,
                gender,
                interests: selected,
                about,
                photos: urls // apenas URLs
            }

            const response = await axios.post('/api/register', payload)
            console.log('✅ Cadastro feito:', response.data.message)
            toast.success('Cadastro finalizado!!')
            setLoading(false)
        } catch (err: any) {
            console.error('❌ Erro ao cadastrar:', err?.response?.data || err?.message || err)
            toast.error(err?.response?.data?.message || err?.message || 'Erro ao cadastrar.')
            setLoading(false)
        }
    }

    return (
        <>
            <BackHeader title='Cadastre-se' />
            <Container>
                <div className='lg:flex lg:justify-center lg:h-200 lg:items-center h-174 flex justify-center items-center'>
                    <form className='w-100' onSubmit={handleSubmit}>
                        <div className='flex flex-col'>

                            {/* LOGO + TÍTULO */}
                            <div className='flex flex-col items-center justify-center gap-0.5'>
                                <Image src={logo} alt='SpotMe' className='w-35 h-35 lg:w-60 lg:h-60' />
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

                            {/* FORM STEPS */}
                            <div className='mt-5'>
                                {step === 1 && (
                                    <>
                                        <div className='m-2'>
                                            <Input
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                                type="text"
                                                placeholder="Nome e Sobrenome"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className='m-2'>
                                            <Input
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                                type="text"
                                                placeholder="Telefone/WhatsApp"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                        <div className='m-2'>
                                            <Input
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                                type="text"
                                                placeholder="Data de Nascimento"
                                                maxLength={10}
                                                value={birthdate}
                                                onChange={(e) => setBirthdate(formatDate(e.target.value))} />
                                        </div>
                                        <div className="m-2">
                                            <Select onValueChange={(value) => setGender(value)} value={gender}>
                                                <SelectTrigger className="w-full border-[var(--border-input)] px-4 text-sm text-gray-700 bg-white transition-colors duração-200 ease-in-out focus:outline-none focus:border-[var(--pink-strong)] focus:ring-1 focus:ring-[var(--pink-strong)] focus:ring-offset-0.2 data-[state=open]:border-[var(--pink-strong)] data-[state=open]:ring-1 data-[state=open]:ring-[var(--pink-strong)] data-[state=open]:ring-offset-0.2">
                                                    <SelectValue placeholder="Gênero" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                                    <SelectItem value="Feminino">Feminino</SelectItem>
                                                    <SelectItem value="Outro">Outro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='m-2'>
                                            <Textarea
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                                placeholder="Sobre você"
                                                onChange={(e) => setAbout(e.target.value)} />
                                        </div>
                                        <div className="m-2 flex gap-2 mt-4 flex-col">
                                            <h2 className='text-[14.5px] text-gray-700'>Interesses</h2>
                                            <div className='flex flex-row gap-4 flex-wrap'>
                                                {["Relacionamento Sério 💍", "Novas Amizades 🤝", "Encontros Casuais 😏", "Só Observando 👀"].map((label) => (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => setSelected(label)}
                                                        className={`py-2 px-3 rounded-3xl border transition-colors duração-200 text-sm border-[var(--gray)] ${selected === label ? "bg-[#bdbdbd] text-[#000]" : "bg-transparent text-black hover:bg-[var(--pink-strong)]/10"}`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <div className="m-2">
                                        <label className="text-[14.5px] text-gray-700 mb-2">Envie até 3 fotos</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--pink-strong)] file:text-white hover:file:bg-pink-700 cursor-pointer border border-[var(--border-input)] rounded-md focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-[0.2rem] focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                        />
                                        {photos.length > 0 && (
                                            <div className="flex gap-2 mt-4 flex-wrap">
                                                {photos.map((item, i) => (
                                                    <div key={i} className="relative w-[100px] h-[100px] border rounded overflow-hidden">
                                                        <img src={item.preview} alt={`preview-${i}`} className="object-cover w-full h-full" />
                                                        <button type="button" onClick={() => handleRemovePhoto(i)} className="absolute top-1 right-1 text-white bg-black/50 rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {step === 3 && (
                                    <>
                                        <div className="m-2">
                                            <Input
                                                type="email"
                                                placeholder="E-mail"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                            />
                                        </div>
                                        <div className="m-2">
                                            <Input
                                                type="password"
                                                placeholder="Senha"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                            />
                                        </div>
                                        <div className="m-2">
                                            <Input
                                                type="password"
                                                placeholder="Confirmar Senha"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="bg-[var(--white)] text-[14.5px] h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duração-200 ease-in-out"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Navegação entre steps */}
                                <div className='flex justify-between mt-6 mx-2 flex-wrap items-center'>
                                    {step > 1 && <Button className='py-2 px-5' title="Voltar" onClick={() => setStep(step - 1)} />}
                                    {step < 3
                                        ? <Button className={`py-2 px-5 ${step === 1 ? 'w-full' : ''}`} title="Continuar" onClick={() => setStep(step + 1)} />
                                        : <Button loading={loading} className='py-2 px-5' title="Finalizar Cadastro" type="submit" />}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    )
}

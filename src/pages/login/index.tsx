import BackHeader from '@/components/BackHeader'
import Container from '@/components/Container'
import React, { FormEvent, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import Button from '@/components/Button'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../public/spotme_logo.png'
import { GoHeart } from "react-icons/go";
import { IoPeopleOutline } from "react-icons/io5";
import { auth } from '@/services/firebaseConfig'
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router'
import toast from "react-hot-toast";
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user]);

  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    const toastEntering = toast.loading('Entrando...')

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      localStorage.setItem('token', token);
      await router.push('/dashboard');
      toast.success('Bem-vindo!', { id: toastEntering })
    } catch (error: any) {
      console.error('Erro ao logar:', error.message);
      toast.error('E-mail ou senha inválidos', { id: toastEntering })

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackHeader title='Login' />
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
                    type="email"
                    placeholder="E-mail"
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                  />
                </div>

                <div className='m-2'>
                  <Input
                    type="password"
                    placeholder="Senha"
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border border-[var(--border-input)] focus-visible:ring-1 focus-visible:ring-[var(--pink-strong)] focus-visible:ring-offset-0.2 focus-visible:border-[var(--pink-strong)] transition-colors duration-200 ease-in-out"
                  />
                </div>

                <div className='flex justify-center mt-3'>
                  <Button loading={loading} className='w-full' title='Entrar' onClick={handleLogin} />
                </div>

                <div className='flex justify-center mt-4 flex-col items-center gap-3'>
                  <span className='text-[14px]'>Não tem uma conta? <Link className='underline font-bold ' prefetch={true} href={'/cadastre-se'}>Cadastre-se</Link></span>
                  <Link href={'/recuperar-senha'} className='text-[14px]'>Esqueceu sua senha?</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container >
    </>
  )
}

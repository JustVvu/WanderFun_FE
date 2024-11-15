import React from 'react'
import Image from 'next/image'
import banner from '../assets/banner.jpeg'
import { LoginForm } from './component/loginForm'

export default function Login() {
    return (
        <div className='flex flex-nowrap flex-row-reverse'>
            <div className='w-screen h-screen'>
                <Image src={banner} alt='Banner image' unoptimized
                    className='w-full h-full object-cover object-center' />
            </div>

            <div className='w-1/4 min-w-fit h-screen self-end absolute'>
                <LoginForm />
            </div>
        </div>
    )
}

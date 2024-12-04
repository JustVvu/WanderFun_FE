"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState } from "react"

import { redirect } from "next/navigation"
import Image from "next/image"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import logo from '@/app/assets/Logo.svg'
import { login } from "@/services/authServices"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export function LoginForm() {

    const [loginFailed, setLoginFailed] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLogin = async (data: z.infer<typeof formSchema>) => {
        const { email, password } = data;
        const isLogin = await login(email, password);
        if (isLogin) {
            console.log("Login success!, email: ", email, "password: ", password);
            redirect("/home");
        }
        else {
            console.log("Login failed!");
            setLoginFailed(true);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-white1 justify-items-center
            bg-clip-padding shadow-xl shadow-black4 px-[35px] py-[35px] text-black4">

            <div className="flex-col space-y-0 justify-items-center">
                <div className="flex flex-row items-center space-x-2">
                    <Image src={logo} alt='Banner image' unoptimized style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'fill',
                        objectPosition: 'center',
                    }} />
                    <h1 className="text-[45px] font-normal font-Caveat text-black4">WanderFun</h1>
                </div>
                <h1 className="text-lg font-semibold font-Poppins">Dành cho quản trị viên</h1>
            </div>

            <div className="flex-col justify-items-center mt-14 mb-5">
                <h1 className="text-2xl font-semibold">Đăng nhập</h1>
                <h1 className="text-sm font-normal">Hãy điền thông tin của bạn!</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className='flex flex-col h-full"'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-0 w-auto min-w-[250px] mt-[20px]">
                                <FormLabel>Email</FormLabel>
                                <FormControl className="h-[40px] rounded-[12px] border-none bg-white3 ">
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-0 w-auto min-w-[250px] mt-[20px]">
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl className="h-[40px] rounded-[12px] bg-white3 border-none">
                                    <Input type="password" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row justify-between space-x-4 mt-[8px]">
                        <div className="flex flex-row items-center space-x-1">
                            <Checkbox className="border-[2px] rounded-[3px] font-bold data-[state=checked]:border-blue1 data-[state=checked]:bg-blue1 data-[state=checked]:text-white" />
                            <label htmlFor="remember" className="text-sm font-normal">Ghi nhớ đăng nhập</label>
                        </div>
                        <a href="#" className="text-blue2 text-sm font-normal hover:underline">Quên mật khẩu?</a>
                    </div>

                    <FormMessage className={`text-[14px] mt-[20px] self-end ${loginFailed ? 'text-red5' : 'text-transparent'}`}>
                        Thông tin đăng nhập không hợp lệ!
                    </FormMessage>

                    <Button
                        className="w-full min-w-[250px] h-[40px] mt-[20px] bg-blue2 text-white1 rounded-[12px] font-Poppins hover:bg-blue3"
                        type="submit">
                        Đăng nhập
                    </Button>
                </form>
            </Form>
            <div className="justify-items-end mt-auto">
                <p className="text-[12px] font-semibold text-black2">© DA2 - VT - 2024</p>
            </div>
        </div>
    )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import logo from '@/app/assets/Logo.svg'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Invalid Email.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function LoginForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div className="flex flex-wrap flex-col w-full h-full bg-white1 justify-items-center
            bg-clip-padding shadow-xl shadow-black4 px-[35px] py-[35px] text-black4 font-Poppins">

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
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col h-full"'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-0 w-auto min-w-[250px] mt-[20px]">
                                <FormLabel>Email</FormLabel>
                                <FormControl className="h-[40px] rounded-[12px] border-none bg-white3 ">
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage className="h-[20px] text-red4" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-0 w-auto min-w-[250px] mt-[20px]">
                                <FormLabel>Password</FormLabel>
                                <FormControl className="h-[40px] rounded-[12px] bg-white3 border-none">
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage className="h-[20px] text-red4" />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row justify-between space-x-4 mt-[8px]">
                        <div className="flex flex-row justify-items-center">
                            <input type="checkbox" id="remember" name="remember" value="remember" />
                            <label htmlFor="remember" className="text-sm font-normal">Ghi nhớ đăng nhập</label>
                        </div>
                        <a href="#" className="text-blue2 text-sm font-normal hover:underline">Quên mật khẩu?</a>
                    </div>

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

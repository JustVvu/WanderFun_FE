"use client"

import { useState, useEffect } from "react"

import { Trophy, Home, MapIcon, User, LogOut, } from "lucide-react"
import Image from "next/image"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext"
import logo from '@/app/assets/Logo.svg'

import {
    Sidebar,
    SidebarProvider,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useLoading } from "@/contexts/LoadingContext";

// Menu items.
const menuItems = [
    {
        title: "Trang chủ",
        url: "/home",
        icon: Home,
        isSelect: true,
    },
    {
        title: "Người dùng",
        url: "/users",
        icon: User,
        isSelect: false,
    },
    {
        title: "Điểm du lịch",
        url: "/places",
        icon: MapIcon,
        isSelect: false,
    },
    // {
    //     title: "Bảng xếp hạng",
    //     url: "/leaderboard",
    //     icon: Trophy,
    //     isSelect: false,
    // },
]

export function AppSidebar() {

    const { setLoadingState } = useLoading()
    const pathname = usePathname()
    const { logout } = useUser()
    const [selectedTab, setSelectedTab] = useState("");
    const router = useRouter();

    useEffect(() => {
        const name = menuItems.find((item) => item.url === pathname)?.title;
        if (name) {
            setSelectedTab(name);
        } else if (pathname === "/") {
            setSelectedTab("Trang chủ");
        }
    }, [pathname]);

    const handleNavigate = (url: string, title: string) => {
        setLoadingState(true);
        setSelectedTab(title);
        router.push(url);
    };

    const handleLogut = () => {
        logout()
    }

    return (
        <SidebarProvider>
            <Sidebar
                collapsible="none"
                className="h-full w-auto py-[20px] px-[16px]"
                variant="floating"
            >
                <SidebarHeader>
                    <div className="flex-col space-y-0 justify-items-center">
                        <div className="flex flex-row items-center space-x-2 overflow-hidden">
                            <Image src={logo} alt='Banner image' unoptimized style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'fill',
                                objectPosition: 'center',
                            }} />
                            <h1 className="text-[45px] font-normal font-Caveat text-black4">WanderFun</h1>
                        </div>
                        <h1 className="text-lg font-semibold text-black4">Dành cho quản trị viên</h1>
                        <h1 className="text-[14px] font-normal text-black4">Chào mừng bạn quay trở lại</h1>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item, index) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`h-auto rounded-[8px] text-black3 text-[16px] font-medium 
                                            hover:bg-blue2o hover:text-blue3 active:bg-blue2o active:text-blue3 ${selectedTab === item.title ? 'bg-blue2o text-blue3' : ''}
                                            transition duration-100 ease-in-out`}
                                        >
                                            <Link
                                                key={index}
                                                onClick={() => handleNavigate(item.url, item.title)}
                                                href={item.url}>
                                                <item.icon style={{ width: '20px', height: '20px' }} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className={`items-center h-auto rounded-[8px] text-black3 text-[16px] font-medium 
                                            hover:bg-red-200 hover:text-red3 transition duration-100 ease-in-out`}
                                        onClick={handleLogut}
                                    >
                                        <Button variant='ghost' className="bg-white justify-start">
                                            <LogOut style={{ width: '20px', height: '20px' }} />
                                            Đăng xuất
                                        </Button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}

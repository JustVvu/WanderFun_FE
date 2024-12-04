import React from 'react'

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../components/data_table/AppDataTable'
import { columns, type User } from "./columns"


async function getData(): Promise<User[]> {
    // Fetch data from your API here.
    return [
        { id: "1", userName: "Nguyễn Văn A", birthday: "1998-01-01", status: "active" },
        { id: "2", userName: "Nguyễn Văn B", birthday: "1998-01-01", status: "active" },
        { id: "3", userName: "Nguyễn Văn C", birthday: "1998-01-01", status: "active" },
        { id: "4", userName: "Nguyễn Văn D", birthday: "1998-01-01", status: "active" },
        { id: "5", userName: "Nguyễn Văn E", birthday: "1998-01-01", status: "banned" },
        { id: "6", userName: "Nguyễn Văn F", birthday: "1998-01-01", status: "active" },
        { id: "7", userName: "Nguyễn Văn G", birthday: "1998-01-01", status: "active" },
        { id: "8", userName: "Nguyễn Văn H", birthday: "1998-01-01", status: "banned" },
        { id: "9", userName: "Nguyễn Văn I", birthday: "1998-01-01", status: "active" },
        { id: "10", userName: "Nguyễn Văn K", birthday: "1998-01-01", status: "active" },
        { id: "11", userName: "Nguyễn Văn L", birthday: "1998-01-01", status: "active" },
        { id: "12", userName: "Nguyễn Văn M", birthday: "1998-01-01", status: "banned" },
        { id: "13", userName: "Nguyễn Văn N", birthday: "1998-01-01", status: "active" },
    ]
}

export default async function User() {

    const data = await getData()

    return (
        <div className=' flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-[24px] text-blue3 font-medium'>Quản lý địa điểm du lịch</h1>
                <div className='flex flex-row justify-between items-center space-x-[2rem]'>
                    <Button
                        className="w-fit h-fit bg-blue2 text-white1 rounded-[8px] font-Poppins hover:bg-blue3"
                    >
                        Xem trên bản đồ
                    </Button>
                    <Button
                        className="w-fit h-fit bg-blue2 text-white1 rounded-[8px] font-Poppins hover:bg-blue3"
                    >
                        Thêm địa điểm
                    </Button>
                </div>
            </div>
            <div >
                <AppDataTable
                    columns={columns}
                    data={data}
                    filterCritia='userName'
                    filterPlaceholder='Tên người dùng'
                />
            </div>
        </div>
    )
}

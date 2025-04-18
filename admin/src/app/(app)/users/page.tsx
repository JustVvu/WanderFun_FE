'use client'

import { useEffect, useState, useCallback } from 'react'

import { AppDataTable } from '../../components/data_table/AppDataTable'
import { useColumns } from "./columns"
import type { User } from '@/models/user';
import { getAllUsers } from '@/app/actions/users-action';


export default function User() {

    const [data, setData] = useState<User[]>([]);

    const getData = useCallback(async () => {
        const fetchedData = await getAllUsers();
        console.log(fetchedData);
        setData(fetchedData);
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    const columns = useColumns(getData);

    return (
        <div className=' flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-[24px] text-blue3 font-medium'>Quản lý tài khoản người dùng</h1>

            </div>
            <div >
                <AppDataTable
                    columns={columns}
                    data={data}
                    filterCritia='firstName'
                    filterPlaceholder='Tên người dùng'
                />
            </div>
        </div>
    )
}

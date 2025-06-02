'use client'

import { useCallback, useEffect, useState } from 'react';

import { AppDataTable } from '@/app/components/data_table/AppDataTable';
import { getAllUserAccounts } from '@/app/services/usersServices';
import { Account } from '@/models/users/account';

import { useColumns } from './userColumns';

export default function AccountPage() {

    const [data, setData] = useState<Account[]>([]);

    const getData = useCallback(async () => {
        const fetchedData = await getAllUserAccounts();
        //console.log(fetchedData);
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
                    filterCritia='email'
                    filterPlaceholder='Email người dùng'
                />
            </div>
        </div>
    )
}

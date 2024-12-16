import React from 'react'
import { AppAreaChart } from '../../components/AppAreaChart'
import { AppBarChart } from '../../components/AppBarChart'

export default function Home() {
    return (
        <div className='flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <h1 className='text-[24px] text-blue3 font-medium'>Trang chủ</h1>

            <div className='flex flex-row w-full mt-[3rem] space-x-[20px]'>

                <AppAreaChart />
                <AppBarChart />
            </div>

        </div>
    )
}

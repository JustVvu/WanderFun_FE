import React from 'react'
import { AppAreaChart } from '../../components/AppAreaChart'
import { AppBarChart } from '../../components/AppBarChart'

export default function Home() {
    return (
        <div className='justify-items-center'>
            <h1 className='text-[30px] font-semibold place-self-start'>Dashboard</h1>

            <div className='flex flex-row mt-[3rem] space-x-[20px]'>

                <AppAreaChart />
                <AppBarChart />
            </div>

        </div>
    )
}

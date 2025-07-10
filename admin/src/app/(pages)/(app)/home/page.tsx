'use client'

import React, { useEffect, useState } from 'react'
import { AppAreaChart } from '@/app/components/AppAreaChart'
import { getStatistics } from '@/app/services/statistics/statisticServices';
import { Card, CardTitle } from '@/components/ui/card';
import { Statistic } from '@/models/statistics/statistic';
import { TopCheckInTable } from './components/topCheckinTable';
import { VerifiedStatusPieChart } from './components/verifiedPieChart';

export default function Home() {
    const [statistics, setStatistics] = useState<Statistic>();


    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const statistics = await getStatistics();
                console.log('Statistics fetched:', statistics);
                if (statistics) {
                    setStatistics(statistics);
                } else {
                    console.error('No statistics data available');
                    setStatistics({
                        totalUsers: 0,
                        totalPlaces: 0,
                        totalCheckInAllTime: 0,
                        totalCreatedAccountsToday: 0,
                        accountsList: [{
                            createAt: '',
                            verified: false
                        }],
                        totalCheckInToday: 0,
                        topCheckInPlaces: [{
                            placeId: 0,
                            name: '',
                            checkInCount: 0,
                            ranking: 0
                        }],
                        topCheckInUsers: [{
                            userId: 0,
                            firstName: '',
                            lastName: '',
                            avatarUrl: '',
                            point: 0,
                            checkInCount: 0,
                            ranking: 0
                        }]
                    });
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
        fetchStatistics();
    }, []);

    return (
        <div className='flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <h1 className='text-[24px] text-blue3 font-medium'>Trang chủ</h1>

            <Card className='flex flex-row w-auto mt-[2rem] space-x-5 p-4 justify-evenly'>
                <Card className='w-[300px] h-min-[200px] space-y-4 p-[20px] border-[2px] text-center bg-blue-50 border-blue2 text-blue2'>
                    <h2 className='text-[20px] font-semibold'>Tổng số địa điểm</h2>
                    <p className='text-[16px]'>Số lượng địa điểm hiện có trong hệ thống.</p>
                    <CardTitle className='text-5xl font-bold justify-self-center self-end'>
                        {statistics?.totalPlaces}
                    </CardTitle>
                </Card>
                <Card className='w-[300px] h-min-[200px] space-y-4 p-[20px] border-[2px] text-center bg-green-50 border-green4 text-green4'>
                    <h2 className='text-[20px] font-semibold'>Tổng số người dùng</h2>
                    <p className='text-[16px]'>Số lượng người sử dụng ứng dụng.</p>
                    <CardTitle className='text-5xl font-bold mt-[10px] justify-self-center '>
                        {statistics?.totalUsers}
                    </CardTitle>
                </Card>
                <Card className='w-[300px] h-min-[200px] space-y-4 p-[20px] border-[2px] text-center bg-blue-50 border-blue2 text-blue2'>
                    <h2 className='text-[20px] font-semibold'>Tài khoản mới</h2>
                    <p className='text-[16px]'>Số lượng tài khoản được tạo trong hôm nay.</p>
                    <CardTitle className='text-5xl font-bold mt-[10px] justify-self-center '>
                        {statistics?.totalCreatedAccountsToday}
                    </CardTitle>
                </Card>
                <Card className='w-[300px] h-min-[200px] space-y-4 p-[20px] border-[2px] text-center bg-green-50 border-green4 text-green4'>
                    <h2 className='text-[20px] font-semibold'>Tổng lượt Check-in</h2>
                    <p className='text-[16px]'>Tổng lượt check-in được tạo bởi người dùng.</p>
                    <CardTitle className='text-5xl font-bold mt-[10px] justify-self-center '>
                        {statistics?.totalCheckInAllTime}
                    </CardTitle>
                </Card>
                <Card className='w-[300px] h-min-[200px] space-y-4 p-[20px] border-[2px] text-center bg-blue-50 border-blue2 text-blue2'>
                    <h2 className='text-[20px] font-semibold'>Lượt Check-in hôm nay</h2>
                    <p className='text-[16px]'>Số lượng địa điểm hiện có trong hệ thống.</p>
                    <CardTitle className='text-5xl font-bold mt-[10px] justify-self-center '>
                        {statistics?.totalCheckInToday}
                    </CardTitle>
                </Card>
            </Card>

            <div className='flex flex-row w-full mt-[3rem] space-x-[20px]'>

                <AppAreaChart
                    createdAtList={statistics?.accountsList?.map((a) => a.createAt) ?? []}
                />

                <div className='grid-rows-2'>
                    <VerifiedStatusPieChart accountsList={statistics?.accountsList ?? []} />
                </div>

            </div>

            <div className='flex flex-row w-full mt-[3rem] space-x-[20px]'>
                <TopCheckInTable data={statistics?.topCheckInPlaces ?? []} type="places" />

                <TopCheckInTable data={statistics?.topCheckInUsers ?? []} type="users" />
            </div>

        </div>
    )
}

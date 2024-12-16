'use client'

import { useEffect, useState } from 'react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { type Place, type User, columnsPlace, columnsUser } from "./columns"
import { AppDataTable } from '@/app/components/data_table/AppDataTable';

async function fetchData(): Promise<Place[]> {
    // Fetch data from your API here.
    return [
        { placeName: "Phố cổ Hội An", totalCheckin: 2000, avgRating: 4.9 },
        { placeName: "Vịnh Hạ Long", totalCheckin: 3000, avgRating: 4.8 },
        { placeName: "Chợ Bến Thành", totalCheckin: 1800, avgRating: 4.2 },
        { placeName: "Hồ Gươm", totalCheckin: 2500, avgRating: 4.5 },

    ]
}

export default function Leaderboard() {

    const [placeData, setPlaceData] = useState<Place[]>([]);

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData();
            console.log(fetchedData);
            console.log(fetchedData.sort((a, b) => b.totalCheckin - a.totalCheckin));

            setPlaceData(fetchedData);
        };
        getData();
    }, []);

    return (
        <div className='flex flex-col h-full m-[24px] p-[20px] rounded-2xl bg-white'>
            <h1 className='text-[24px] text-blue3 font-medium'>Bảng xếp hạng</h1>
            <Tabs defaultValue="place" className="w-full mt-[24px]">
                <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="place">Địa điểm</TabsTrigger>
                    <TabsTrigger value="user">Người dùng</TabsTrigger>
                </TabsList>
                <TabsContent value="place">
                    <div className="flex flex-col">
                        <AppDataTable
                            columns={columnsPlace}
                            data={placeData}
                            filterCritia='placeName'
                            filterPlaceholder='Tên địa diểm'
                        />
                    </div>

                </TabsContent>
                <TabsContent value="user">
                    <div className="flex flex-col">

                    </div>

                </TabsContent>
            </Tabs >

        </div>
    )
}

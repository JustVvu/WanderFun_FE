'use client'

import { MapPinPlus, MapPinned } from "lucide-react"

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../components/data_table/AppDataTable'
import { useColumns } from "./columns"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import type { Place } from "@/types/place"
import * as placeAction from '@/actions/places-action'

export default function Place() {

    const router = useRouter();

    const [data, setData] = useState<Place[]>([]);

    const getData = useCallback(async () => {
        const fetchedData = await placeAction.getAllPlaces();
        setData(fetchedData);
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);


    const columns = useColumns(getData);

    return (
        <div className='flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-[24px] text-blue3 font-medium'>Quản lý địa điểm du lịch</h1>
                <div className='flex flex-row justify-between items-center space-x-[2rem]'>
                    <Button
                        onClick={() => router.push('maps')}
                        className="w-fit h-fit bg-white1 text-blue2 border-blue2 border rounded-[8px] hover:bg-white3"
                    >
                        <MapPinned /> Xem trên bản đồ
                    </Button>
                    <Button
                        onClick={() => router.push('places/add')}
                        className="w-fit h-fit bg-blue2 text-white1 border rounded-[8px] hover:bg-blue3"
                    >
                        <MapPinPlus /> Thêm địa điểm
                    </Button>
                </div>
            </div>
            <div >
                <AppDataTable
                    columns={columns}
                    data={data}
                    filterCritia='name'
                    filterPlaceholder='Tên địa diểm'
                />
            </div>
        </div>
    )
}

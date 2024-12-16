'use client'

import { MapPinPlus, MapPinned } from "lucide-react"

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../components/data_table/AppDataTable'
import { columns, type Place } from "./columns"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"


async function fetchData(): Promise<Place[]> {
    // Fetch data from your API here.
    return [
        { placeName: "Bãi biển Mỹ Khê tuyệt đẹp, mọi người nên đến đây thường xuyên", province: "Đà Nẵng", district: "Sơn Trà", totalCheckin: 1500, avgRating: 4.7 },
        { placeName: "Phố cổ Hội An", province: "Quảng Nam", district: "Hội An", totalCheckin: 2000, avgRating: 4.9 },
        { placeName: "Vịnh Hạ Long", province: "Quảng Ninh", district: "Hạ Long", totalCheckin: 3000, avgRating: 4.8 },
        { placeName: "Chợ Bến Thành", province: "Hồ Chí Minh", district: "Quận 1", totalCheckin: 1800, avgRating: 4.2 },
        { placeName: "Hồ Gươm", province: "Hà Nội", district: "Hoàn Kiếm", totalCheckin: 2500, avgRating: 4.5 },
        { placeName: "Bãi biển Mỹ Khê", province: "Đà Nẵng", district: "Sơn Trà", totalCheckin: 1500, avgRating: 4.7 },
        { placeName: "Phố cổ Hội An", province: "Quảng Nam", district: "Hội An", totalCheckin: 2000, avgRating: 4.9 },
        { placeName: "Vịnh Hạ Long", province: "Quảng Ninh", district: "Hạ Long", totalCheckin: 3000, avgRating: 4.8 },
        { placeName: "Chợ Bến Thành", province: "Hồ Chí Minh", district: "Quận 1", totalCheckin: 1800, avgRating: 4.2 },
        { placeName: "Hồ Gươm", province: "Hà Nội", district: "Hoàn Kiếm", totalCheckin: 2500, avgRating: 4.5 },
        { placeName: "Bãi biển Mỹ Khê", province: "Đà Nẵng", district: "Sơn Trà", totalCheckin: 1500, avgRating: 4.7 },
        { placeName: "Phố cổ Hội An", province: "Quảng Nam", district: "Hội An", totalCheckin: 2000, avgRating: 4.9 },
        { placeName: "Vịnh Hạ Long", province: "Quảng Ninh", district: "Hạ Long", totalCheckin: 3000, avgRating: 4.8 },
        { placeName: "Chợ Bến Thành", province: "Hồ Chí Minh", district: "Quận 1", totalCheckin: 1800, avgRating: 4.2 },
        { placeName: "Hồ Gươm", province: "Hà Nội", district: "Hoàn Kiếm", totalCheckin: 2500, avgRating: 4.5 },

    ]
}

export default function Place() {

    const router = useRouter();

    const [data, setData] = useState<Place[]>([]);

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData();
            setData(fetchedData);
        };
        getData();
    }, []);

    return (
        <div className='flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-[24px] text-blue3 font-medium'>Quản lý địa điểm du lịch</h1>
                <div className='flex flex-row justify-between items-center space-x-[2rem]'>
                    <Button
                        className="w-fit h-fit bg-white1 text-blue2 border-blue2 border rounded-[8px] hover:bg-white3"
                    >
                        <MapPinned /> Xem trên bản đồ
                    </Button>
                    <Button
                        onClick={() => router.push('places/add-place')}
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
                    filterCritia='placeName'
                    filterPlaceholder='Tên địa diểm'
                />
            </div>
        </div>
    )
}

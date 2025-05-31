'use client'

import { MapPinPlus, MapPinned, FileSpreadsheet } from "lucide-react"

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../../components/data_table/AppDataTable'
import { useColumns as usePlaceColumns } from "./placeColumns"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import type { Place } from "@/models/places/place"
import * as placeServices from '@/app/services/places/placesServices'
import { Input } from "@/components/ui/input"
import { convertExcelArrayToJSON, readExcelFile, excelImportHelper } from "@/helpers/excelHelper"
import { toast } from "sonner"
import { useLoading } from "@/contexts/LoadingContext"


export default function Place() {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setLoadingState } = useLoading()

    const [placeData, setPlaceData] = useState<Place[]>([]);

    const getPlaceData = useCallback(async () => {
        const fetchedPlaceData = await placeServices.getAllPlaces();
        setPlaceData(fetchedPlaceData);
    }, []);

    useEffect(() => {
        getPlaceData();
    }, [getPlaceData]);

    const placeColumns = usePlaceColumns(getPlaceData);

    const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log('Uploading file:', file.name);
        try {
            setLoadingState(true)
            const rawData = await readExcelFile(file);
            //console.log('Raw data from Excel:', rawData);
            const jsonData = convertExcelArrayToJSON(rawData);
            const payload = await excelImportHelper(jsonData);
            //console.log('Payload:', payload);
            await placeServices.addListPlace(payload)
                .then(() => {
                    toast.success('Thêm địa điểm thành công!');
                    getPlaceData();
                    setLoadingState(false)
                })
                .catch((error) => {
                    console.error('Error adding place:', error);
                    toast.error(`Error adding place: ${String(error)}`);
                })
        } catch (err) {
            //console.error('Error processing Excel file:', err);
            toast.error(`Error processing Excel file: ${String(err)}`);
        } finally {
            setLoadingState(false)
        }
    };

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

                    <Input
                        type='file'
                        ref={fileInputRef}
                        accept='.xlsx, .xls, .csv'
                        onChange={handleExcelImport}
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-fit h-fit bg-white1 text-green4 border-green4 border rounded-[8px] hover:bg-white3"
                    >
                        <FileSpreadsheet /> Nhập từ file Excel
                    </Button>
                </div>
            </div>
            <div >
                <AppDataTable
                    columns={placeColumns}
                    data={placeData}
                    filterCritia='name'
                    filterPlaceholder='Tên địa diểm'
                />
            </div>
        </div>
    )
}


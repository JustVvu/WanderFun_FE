'use client'

import { MapPinPlus, MapPinned, FileSpreadsheet } from "lucide-react"

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../components/data_table/AppDataTable'
import { useColumns } from "./columns"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import type { PlaceCategory } from "@/models/places/placeCategory"
import * as placeCategoryAction from '@/app/services/places/placeCategoriesServices'
import { Input } from "@/components/ui/input"
import { convertExcelArrayToJSON, readExcelFile, excelImportHelper } from "@/helpers/excelHelper"
import { toast } from "sonner"
import { useLoading } from "@/contexts/LoadingContext"


export default function PlaceCategory() {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setLoadingState } = useLoading()

    const [data, setData] = useState<PlaceCategory[]>([]);

    const getData = useCallback(async () => {
        const fetchedData = await placeCategoryAction.getAllPlaceCategories();
        setData(fetchedData);
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    const columns = useColumns(getData);

    // const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     console.log('Uploading file:', file.name);

    //     try {
    //         setLoadingState(true)
    //         const rawData = await readExcelFile(file);
    //         const jsonData = convertExcelArrayToJSON(rawData);
    //         //const payload = adminExcelImportHelper(jsonData);
    //         const payload = await excelImportHelper(jsonData);
    //         console.log('Payload:', payload);
    //         placeCategoryAction.addListPlaceCategory(payload)
    //             .then(() => {
    //                 toast.success('Thêm địa điểm thành công!');
    //                 getData();
    //             })
    //             .catch((error) => {
    //                 console.error('Error adding placeCategory:', error);
    //                 toast.error(`Error adding placeCategory: ${String(error)}`);
    //             })
    //     } catch (err) {
    //         //console.error('Error processing Excel file:', err);
    //         toast.error(`Error processing Excel file: ${String(err)}`);
    //     } finally {
    //         setLoadingState(false)
    //     }
    // };

    return (
        <div className='flex flex-col m-[24px] p-[20px] rounded-2xl bg-white'>
            <div className='flex flex-row justify-between items-center '>
                <h1 className='text-[24px] text-blue3 font-medium'>Quản lý phân loại địa điểm</h1>
                <div className='flex flex-row justify-between items-center space-x-[2rem]'>
                    <Button
                        onClick={() => router.push('maps')}
                        className="w-fit h-fit bg-white1 text-blue2 border-blue2 border rounded-[8px] hover:bg-white3"
                    >
                        <MapPinned /> Xem trên bản đồ
                    </Button>
                    <Button
                        onClick={() => router.push('placeCategorys/add')}
                        className="w-fit h-fit bg-blue2 text-white1 border rounded-[8px] hover:bg-blue3"
                    >
                        <MapPinPlus /> Thêm địa điểm
                    </Button>

                    <Input
                        type='file'
                        ref={fileInputRef}
                        accept='.xlsx, .xls, .csv'
                        //onChange={handleExcelImport}
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
                    columns={columns}
                    data={data}
                    filterCritia='name'
                    filterPlaceCategoryholder='Tên địa diểm'
                />
            </div>
        </div>
    )
}


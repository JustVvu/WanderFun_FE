'use client'

import { MapPinPlus, MapPinned, FileSpreadsheet } from "lucide-react"

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../components/data_table/AppDataTable'
import { useColumns } from "./columns"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import type { AddPlacePayload, Place } from "@/types/place"
import * as placeAction from '@/app/actions/places-action'
import { Input } from "@/components/ui/input"
import { convertExcelArrayToJSON, exportDataToExcel, processExcelDataByColumnNames, readExcelFile } from "@/utils/excelHelper"
import { toast } from "sonner"
import { fetchLatLngFromCSV } from "@/app/actions/map-action"

export default function Place() {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [data, setData] = useState<Place[]>([]);

    const getData = useCallback(async () => {
        const fetchedData = await placeAction.getAllPlaces();
        setData(fetchedData);
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    const columns = useColumns(getData);

    // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     console.log('Uploading file:', file.name);

    //     try {
    //         // Read the Excel file to get the raw data
    //         const rawData = await readExcelFile(file);
    //         // Process the raw data to merge column 2 and column 4 from each row
    //         const processedData = processExcelDataByColumnNames(rawData, ["Tên địa điểm", "Vị trí"]);
    //         const fetchExcelData = await fetchLatLngFromCSV(processedData);
    //         console.log('Fetched Excel results:', fetchExcelData);
    //         const exportData = fetchExcelData.map((result) => ({
    //             Name: result.name,
    //             //Address: result.formatted_address,
    //             Commune: result.compound.commune,
    //             District: result.compound.district,
    //             Province: result.compound.province,
    //             Latitude: result.geometry.location.lat,
    //             Longitude: result.geometry.location.lng,
    //         }));

    //         exportDataToExcel(exportData, 'exported_place_results.xlsx');
    //     } catch (err) {
    //         //console.error('Error processing Excel file:', err);
    //         toast.error(`Error processing Excel file: ${String(err)}`);
    //     }
    // };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log('Uploading file:', file.name);

        try {
            // Read the Excel file to get the raw data
            const rawData = await readExcelFile(file);
            //console.log('Raw Data:', rawData);
            const jsonData = convertExcelArrayToJSON(rawData);
            console.log('JSON Data:', jsonData);
            jsonData.forEach((item) => {
                placeAction.addPlace({
                    name: item.name as string,
                    address: item.address as string,
                    longitude: item.longitude as string,
                    latitude: item.latitude as string,
                } as AddPlacePayload, [], [])

            })
        } catch (err) {
            //console.error('Error processing Excel file:', err);
            toast.error(`Error processing Excel file: ${String(err)}`);
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
                        onChange={handleFileUpload}
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
                    filterPlaceholder='Tên địa diểm'
                />
            </div>
        </div>
    )
}


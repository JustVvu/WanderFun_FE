'use client'

import { MapPinPlus, MapPinned, FileSpreadsheet } from "lucide-react"

import { Button } from '@/components/ui/button'
import { AppDataTable } from '../../components/data_table/AppDataTable'
import { useColumns } from "./columns"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import type { CreatePlacePayload, Place } from "@/models/places/place"
import * as placeAction from '@/app/actions/places-action'
import { Input } from "@/components/ui/input"
import { convertExcelArrayToJSON, mapToAddPlacePayload, /*exportDataToExcel, processExcelDataByColumnNames,*/ readExcelFile } from "@/helpers/excelHelper"
import { toast } from "sonner"
//import { fetchLatLngFromList } from "@/app/actions/map-action"

export default function Place() {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [data, setData] = useState<Place[]>([]);

    const getData = useCallback(async () => {
        console.log('Starting data fetch...');
        const fetchedData = await placeAction.getAllPlaces();
        console.log('Raw fetched data:', fetchedData);
        console.log('Fetched data type:', typeof fetchedData);
        console.log('Fetched data length:', fetchedData?.length);

        setData(fetchedData);
        console.log('State updated with data');
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    // After getting columns
    const columns = useColumns(getData);
    console.log('Column definitions:', columns);

    // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     console.log('Uploading file:', file.name);

    //     try {
    //         // Read the Excel file to get the raw data
    //         const rawData = await readExcelFile(file);
    //         // Process the raw data to merge column 2 and column 4 from each row
    //         const processedData = processExcelDataByColumnNames(rawData, ["Tên địa điểm", "Vị trí"]);
    //         const fetchExcelData = await fetchLatLngFromList(processedData);
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
            const jsonData = convertExcelArrayToJSON(rawData);
            //console.log('JSON Data:', jsonData);
            const payload = mapToAddPlacePayload(jsonData);
            console.log('Payload:', payload);
            placeAction.addListPlace(payload)
                .then(() => {
                    toast.success('Thêm địa điểm thành công!');
                    getData();
                })
                .catch((error) => {
                    console.error('Error adding place:', error);
                    toast.error(`Error adding place: ${String(error)}`);
                })

            // })
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


'use client';

import Head from "next/head";
import AppMap from "./components/AppMap";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MapAdd() {

   const router = useRouter();

   return (
      <div className="m-[24px] p-[20px] rounded-2xl bg-white">
         <Head>
            <link
               rel="stylesheet"
               href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css"
            />
         </Head>
         <div className="flex flex-col justify-between items-center space-y-[24px]">
            <div className="flex flex-row self-start items-center space-x-3">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push('/places')}
                  className="border-[2px] rounded-full"
               >
                  <ChevronLeft />
               </Button>
               <h1 className='text-[20px] text-blue3 font-medium'>Thêm địa điểm du lịch</h1>
            </div>
            <AppMap />
         </div>
      </div>
   );
};


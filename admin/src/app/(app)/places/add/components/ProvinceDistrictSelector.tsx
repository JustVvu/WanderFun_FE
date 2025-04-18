// app/places/components/ProvinceDistrictSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Control } from "react-hook-form";
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox";
import { toast } from "sonner";
import { getAllProvinces, getDistrictsByProvinceCode, /*getWardsByDistrictCode*/ } from "@/app/actions/addresses/address-action";
import { Province } from "@/models/addresses/province";
import { District } from "@/models/addresses/district";
import { Ward } from "@/models/addresses/ward";

interface ProvinceDistrictSelectorProps {
   control: Control<any>;
   provinceCodeName: string;
   districtCodeName: string;
   wardCodeName: string;
}

export default function ProvinceDistrictSelector({
   control,
   provinceCodeName,
   districtCodeName,
   wardCodeName
}: ProvinceDistrictSelectorProps) {
   const [provinces, setProvinces] = useState<Province[]>([]);
   const [districts, setDistricts] = useState<District[]>([]);
   const [wards, setWards] = useState<Ward[]>([]);
   const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
   const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");

   // Load all provinces
   useEffect(() => {
      const fetchProvinces = async () => {
         try {
            const data = await getAllProvinces();
            setProvinces(data || []);
         } catch (error) {
            toast.error(`Không thể tải danh sách tỉnh/thành phố (${error})`);
         }
      };

      fetchProvinces();
   }, []);

   // Load districts when province changes
   useEffect(() => {
      if (!selectedProvinceCode) {
         setDistricts([]);
         return;
      }

      const fetchDistricts = async () => {
         try {
            const data = await getDistrictsByProvinceCode(selectedProvinceCode);
            setDistricts(data || []);
         } catch (error) {
            toast.error(`Không thể tải danh sách quận/huyện (${error})`);
         }
      };

      fetchDistricts();
   }, [selectedProvinceCode]);

   // Load wards when district changes
   // useEffect(() => {
   //    if (!selectedDistrictCode) {
   //       setWards([]);
   //       return;
   //    }

   //    const fetchWards = async () => {
   //       try {
   //          const data = await getWardsByDistrictCode(selectedDistrictCode);
   //          setWards(data || []);
   //       } catch (error) {
   //          toast.error(`Không thể tải danh sách phường/xã (${error})`);
   //       }
   //    };

   //    fetchWards();
   // }, [selectedDistrictCode]);

   return (
      <div className="grid grid-cols-3 gap-6">
         <FormFieldCombobox
            control={control}
            name={provinceCodeName}
            label="Tỉnh/Thành phố"
            options={provinces.map((province) => ({
               label: province.name,
               value: province.code,
            }))}
            placeholder="Chọn tỉnh/thành phố"
            onChange={(value) => {
               setSelectedProvinceCode(value);
            }}
         />

         <FormFieldCombobox
            control={control}
            name={districtCodeName}
            label="Quận/Huyện"
            options={districts.map((district) => ({
               label: district.name,
               value: district.code,
            }))}
            placeholder="Chọn quận/huyện"
            disabled={!selectedProvinceCode}
            onChange={(value) => {
               setSelectedDistrictCode(value);
            }}
         />

         <FormFieldCombobox
            control={control}
            name={wardCodeName}
            label="Phường/Xã"
            options={wards.map((ward) => ({
               label: ward.name,
               value: ward.code,
            }))}
            placeholder="Chọn phường/xã"
            disabled={!selectedDistrictCode}
         />
      </div>
   );
}
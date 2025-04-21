// app/places/components/ProvinceDistrictSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Control, Path, useWatch } from "react-hook-form";
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox";
import { toast } from "sonner";
import { getAllProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "@/app/actions/addresses/address-action";
import { Province } from "@/models/addresses/province";
import { District } from "@/models/addresses/district";
import { Ward } from "@/models/addresses/ward";
import { PlaceFormValues } from "./PlaceFormSchema";

interface ProvinceDistrictSelectorProps {
   control: Control<PlaceFormValues>;
   provinceCodeName: Path<PlaceFormValues>;
   districtCodeName: Path<PlaceFormValues>;
   wardCodeName: Path<PlaceFormValues>;
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

   const provinceCode = useWatch({ control, name: provinceCodeName }) as string;
   const districtCode = useWatch({ control, name: districtCodeName }) as string;

   // Load all provinces
   useEffect(() => {
      getAllProvinces()
         .then((data) => setProvinces(data || []))
         .catch((e) => toast.error(`Không thể tải tỉnh/thành phố (${e})`));
   }, []);

   // Load districts when province changes
   useEffect(() => {
      if (!provinceCode) {
         setDistricts([]);
         return;
      }
      getDistrictsByProvinceCode(provinceCode)
         .then((data) => setDistricts(data || []))
         .catch((e) => toast.error(`Không thể tải quận/huyện (${e})`));
   }, [provinceCode]);

   //Load wards when district changes
   useEffect(() => {
      if (!districtCode) {
         setWards([]);
         return;
      }
      getWardsByDistrictCode(districtCode)
         .then((data) => setWards(data || []))
         .catch((e) => toast.error(`Không thể tải phường/xã (${e})`));
   }, [districtCode]);

   return (
      <div className="grid grid-cols-3 gap-[100px]">
         <FormFieldCombobox
            control={control}
            name={provinceCodeName}
            label="Tỉnh/Thành phố"
            options={provinces.map((province) => ({
               label: province.fullName,
               value: province.code,
            }))}
            placeholder="Chọn tỉnh/thành phố"
         />

         <FormFieldCombobox
            control={control}
            name={districtCodeName}
            label="Quận/Huyện"
            options={districts.map((district) => ({
               label: district.fullName,
               value: district.code,
            }))}
            placeholder="Chọn quận/huyện"
            disabled={!provinceCode}
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
            disabled={!districtCode}
         />
      </div>
   );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Control, Path, useWatch, useFormContext } from "react-hook-form";
import { FormFieldComboBox } from "@/app/components/FormFieldComboBox";
import { toast } from "sonner";
import {
   getAllProvinces,
   getDistrictsByProvinceCode,
   getWardsByDistrictCode,
} from "@/app/services/addresses/addressServices";
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
   wardCodeName,
}: ProvinceDistrictSelectorProps) {
   // grab setValue from the same RHF context as your <Form>
   const { setValue } = useFormContext<PlaceFormValues>();

   const [provinces, setProvinces] = useState<Province[]>([]);
   const [districts, setDistricts] = useState<District[]>([]);
   const [wards, setWards] = useState<Ward[]>([]);

   // watch the field values
   const provinceCode = useWatch({ control, name: provinceCodeName }) as string;
   const districtCode = useWatch({ control, name: districtCodeName }) as string;

   // Track previous values
   const prevProvinceCode = useRef<string>();
   const prevDistrictCode = useRef<string>();

   // load all provinces once
   useEffect(() => {
      getAllProvinces()
         .then((data) => setProvinces(data || []))
         .catch((e) => toast.error(`Không thể tải tỉnh/thành phố (${e})`));
   }, []);

   // whenever provinceCode changes: clear district & ward, then reload districts
   useEffect(() => {
      if (provinceCode && prevProvinceCode.current && provinceCode !== prevProvinceCode.current) {
         setValue(districtCodeName, "");
         setValue(wardCodeName, "");
         setDistricts([]);
         setWards([]);
      }
      prevProvinceCode.current = provinceCode;

      if (!provinceCode) return;

      getDistrictsByProvinceCode(provinceCode)
         .then((data) => setDistricts(data || []))
         .catch((e) => toast.error(`Không thể tải quận/huyện (${e})`));
   }, [provinceCode, districtCodeName, wardCodeName, setValue]);

   // whenever districtCode changes: clear ward, then reload wards
   useEffect(() => {
      if (districtCode && prevDistrictCode.current && districtCode !== prevDistrictCode.current) {
         setValue(wardCodeName, "");
         setWards([]);
      }
      prevDistrictCode.current = districtCode;

      if (!districtCode) return;

      getWardsByDistrictCode(districtCode)
         .then((data) => setWards(data || []))
         .catch((e) => toast.error(`Không thể tải phường/xã (${e})`));
   }, [districtCode, wardCodeName, setValue]);

   return (
      <div className="grid grid-cols-3 gap-[100px]">
         <FormFieldComboBox
            control={control}
            name={provinceCodeName}
            label="Tỉnh/Thành phố"
            options={provinces.map((p) => ({ label: p.fullName, value: p.code }))}
            placeholder="Chọn tỉnh/thành phố"
         />

         <FormFieldComboBox
            control={control}
            name={districtCodeName}
            label="Quận/Huyện"
            options={districts.map((d) => ({ label: d.fullName, value: d.code }))}
            placeholder="Chọn quận/huyện"
            disabled={!provinceCode}
         />

         <FormFieldComboBox
            control={control}
            name={wardCodeName}
            label="Phường/Xã"
            options={wards.map((w) => ({ label: w.fullName, value: w.code }))}
            placeholder="Chọn phường/xã"
            disabled={!districtCode}
         />
      </div>
   );
}

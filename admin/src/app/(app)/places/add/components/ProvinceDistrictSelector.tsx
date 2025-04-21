"use client";

import { useState, useEffect } from "react";
import { Control, Path, useWatch, useFormContext } from "react-hook-form";
import { FormFieldCombobox } from "@/app/components/FormFieldComboBox";
import { toast } from "sonner";
import {
   getAllProvinces,
   getDistrictsByProvinceCode,
   getWardsByDistrictCode,
} from "@/app/actions/addresses/address-action";
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

   // load all provinces once
   useEffect(() => {
      getAllProvinces()
         .then((data) => setProvinces(data || []))
         .catch((e) => toast.error(`Không thể tải tỉnh/thành phố (${e})`));
   }, []);

   // whenever provinceCode changes: clear district & ward, then reload districts
   useEffect(() => {
      setValue(districtCodeName, "");  // remove old district
      setValue(wardCodeName, "");      // remove old ward
      setDistricts([]);
      setWards([]);

      if (!provinceCode) return;

      getDistrictsByProvinceCode(provinceCode)
         .then((data) => setDistricts(data || []))
         .catch((e) => toast.error(`Không thể tải quận/huyện (${e})`));
   }, [provinceCode, districtCodeName, provinceCodeName, wardCodeName, setValue]);

   // whenever districtCode changes: clear ward, then reload wards
   useEffect(() => {
      setValue(wardCodeName, "");  // remove old ward
      setWards([]);

      if (!districtCode) return;

      getWardsByDistrictCode(districtCode)
         .then((data) => setWards(data || []))
         .catch((e) => toast.error(`Không thể tải phường/xã (${e})`));
   }, [districtCode, wardCodeName, setValue]);

   return (
      <div className="grid grid-cols-3 gap-[100px]">
         <FormFieldCombobox
            control={control}
            name={provinceCodeName}
            label="Tỉnh/Thành phố"
            options={provinces.map((p) => ({ label: p.fullName, value: p.code }))}
            placeholder="Chọn tỉnh/thành phố"
         />

         <FormFieldCombobox
            control={control}
            name={districtCodeName}
            label="Quận/Huyện"
            options={districts.map((d) => ({ label: d.fullName, value: d.code }))}
            placeholder="Chọn quận/huyện"
            disabled={!provinceCode}
         />

         <FormFieldCombobox
            control={control}
            name={wardCodeName}
            label="Phường/Xã"
            options={wards.map((w) => ({ label: w.name, value: w.code }))}
            placeholder="Chọn phường/xã"
            disabled={!districtCode}
         />
      </div>
   );
}

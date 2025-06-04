"use client";

import { useState, useEffect, useRef } from "react";
import { Control, Path, useWatch, useFormContext } from "react-hook-form";
import { FormFieldComboBox } from "@/app/components/FormFieldComboBox";
import { toast } from "sonner";
import {
   getAllProvinces,
   getDistrictsByProvinceCode,
   getWardsByDistrictCode,
   getProvinceByName,
   getDistrictByNameAndProvinceCode,
} from "@/app/services/addresses/addressServices";
import { Province } from "@/models/addresses/province";
import { District } from "@/models/addresses/district";
import { Ward } from "@/models/addresses/ward";
import { PlaceFormValues } from "./PlaceFormSchema";

interface ProvinceDistrictSelectorProps {
   control: Control<PlaceFormValues>;
   provinceNameField: Path<PlaceFormValues>;
   districtNameField: Path<PlaceFormValues>;
   wardNameField: Path<PlaceFormValues>;
}

export default function ProvinceDistrictSelector({
   control,
   provinceNameField,
   districtNameField,
   wardNameField,
}: ProvinceDistrictSelectorProps) {
   const { setValue } = useFormContext<PlaceFormValues>();

   const [provinces, setProvinces] = useState<Province[]>([]);
   const [districts, setDistricts] = useState<District[]>([]);
   const [wards, setWards] = useState<Ward[]>([]);
   const [initialized, setInitialized] = useState(false);

   const provinceName = useWatch({ control, name: provinceNameField }) as string;
   const districtName = useWatch({ control, name: districtNameField }) as string;

   const prevProvinceName = useRef<string>();
   const prevDistrictName = useRef<string>();

   const provinceCache = useRef<Record<string, Province>>({});
   const districtCache = useRef<Record<string, District>>({});

   // Load all provinces once
   useEffect(() => {
      getAllProvinces()
         .then((data) => {
            setProvinces(data || []);
            data?.forEach(p => provinceCache.current[p.name] = p);
         })
         .catch((e) => toast.error(`Không thể tải tỉnh/thành phố (${e})`));
   }, []);

   // Province changed => reset district & ward, then load districts
   useEffect(() => {
      const loadDistricts = async () => {
         if (!provinceName) return;

         const province = provinceCache.current[provinceName]
            || await getProvinceByName(provinceName).then(p => {
               if (p) provinceCache.current[provinceName] = p;
               return p;
            });

         if (!province?.code) return;

         const data = await getDistrictsByProvinceCode(province.code).catch((e) => {
            toast.error(`Không thể tải quận/huyện từ tỉnh "${provinceName}" (${e})`);
            return [];
         });

         setDistricts(data || []);
         data?.forEach(d => districtCache.current[`${d.name}-${province.code}`] = d);

         const provinceChanged = prevProvinceName.current && prevProvinceName.current !== provinceName;
         prevProvinceName.current = provinceName;

         if (provinceChanged) {
            setValue(districtNameField, "");
            setValue(wardNameField, "");
            setWards([]);
         }

         // Handle update mode (first time, ward is missing)
         if (!initialized && districtName) {
            const district = districtCache.current[`${districtName}-${province.code}`]
               || await getDistrictByNameAndProvinceCode(districtName, province.code).then(d => {
                  if (d) districtCache.current[`${districtName}-${province.code}`] = d;
                  return d;
               });

            if (district?.code) {
               const wardData = await getWardsByDistrictCode(district.code).catch((e) => {
                  toast.error(`Không thể tải phường/xã từ quận "${districtName}" (${e})`);
                  return [];
               });
               setWards(wardData || []);
            }
         }

         setInitialized(true);
      };

      loadDistricts();
   }, [provinceName]);

   // District changed => reset ward, then load wards
   useEffect(() => {
      const loadWards = async () => {
         if (!provinceName || !districtName || !initialized) return;

         const province = provinceCache.current[provinceName];
         if (!province?.code) return;

         const district = districtCache.current[`${districtName}-${province.code}`]
            || await getDistrictByNameAndProvinceCode(districtName, province.code).then(d => {
               if (d) districtCache.current[`${districtName}-${province.code}`] = d;
               return d;
            });

         if (!district?.code) return;

         const districtChanged = prevDistrictName.current && prevDistrictName.current !== districtName;
         prevDistrictName.current = districtName;

         if (districtChanged) {
            setValue(wardNameField, "");
            setWards([]);
         }

         const wardData = await getWardsByDistrictCode(district.code).catch((e) => {
            toast.error(`Không thể tải phường/xã từ quận "${districtName}" (${e})`);
            return [];
         });

         setWards(wardData || []);
      };

      loadWards();
   }, [districtName]);

   return (
      <div className="grid grid-cols-3 gap-[100px]">
         <FormFieldComboBox
            control={control}
            name={provinceNameField}
            label="Tỉnh/Thành phố"
            options={provinces.map((p) => ({ label: p.fullName, value: p.name }))}
            placeholder="Chọn tỉnh/thành phố"
         />

         <FormFieldComboBox
            control={control}
            name={districtNameField}
            label="Quận/Huyện"
            options={districts.map((d) => ({ label: d.fullName, value: d.name }))}
            placeholder="Chọn quận/huyện"
            disabled={!provinceName}
         />

         <FormFieldComboBox
            control={control}
            name={wardNameField}
            label="Phường/Xã"
            options={wards.map((w) => ({ label: w.fullName, value: w.name }))}
            placeholder="Chọn phường/xã"
            disabled={!districtName}
         />
      </div>
   );
}

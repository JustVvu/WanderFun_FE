import {
   Sidebar,
   SidebarProvider,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarTrigger,
   SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Image from "next/image";

import { Place } from "@/models/place";
import placeholderImage from "@/app/assets/banner.png";
import { Label } from "@/components/ui/label";
import { mapCategoryToEnum } from "@/helpers/convertHelper";
import { PlaceImagesCarousel } from "./PlaceImagesCarousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";


interface FloatingSidebarProps {
   place?: Place;
   isOpen: boolean;
   setIsOpen: (value: boolean) => void;
}

export default function FloatingSidebar({ place, isOpen, setIsOpen }: FloatingSidebarProps) {
   console.log("Place in FloatingSidebar:", place);
   return (
      <>
         {place &&
            <SidebarProvider
               open={isOpen}
               onOpenChange={setIsOpen}
               className="flex flex-row w-[500px] absolute top left-4 z-20"
            >

               <Sidebar
                  collapsible="offcanvas"
                  side="left"
                  variant="sidebar"
                  className="bg-white w-[500px] shadow-lg rounded-r-lg"
               >
                  <SidebarHeader className="h-2/5">
                     <div className="flex flex-col items-center w-full h-full relative">
                        <Image
                           src={place.coverImageUrl ? place.coverImageUrl : placeholderImage}
                           alt="Place image"
                           className="rounded-lg object-cover"
                           quality={100}
                           fill
                        />
                     </div>
                  </SidebarHeader>
                  <SidebarContent className="h-3/4 hide-scrollbar">
                     <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                           <SidebarGroupLabel asChild>
                              <CollapsibleTrigger className="hover:bg-blue2o px-0 font-semibold flex">
                                 <Label className="text-[20px] text-blue2" >Thông tin chi tiết</Label>
                                 <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </CollapsibleTrigger>
                           </SidebarGroupLabel>
                           <CollapsibleContent>
                              <SidebarGroupContent
                                 className="flex flex-col px-2 self-center w-full space-y-2"
                              >
                                 <Label className="text-lg font-semibold text-black4">
                                    {place.name}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Tên gọi khác: {place.alternativeName}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Địa chỉ: {place.address}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Loại hình: {mapCategoryToEnum(place.category)}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Quản lý: {place.operator}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Thời gian hoạt động:
                                    {place.openAllDay ? " Hoạt động cả ngày" : (place.timeOpen && place.timeClose ? ` ${place.timeOpen.toString()} - ${place.timeClose.toString()}` : "")}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Tình trạng: {place.closing
                                       ? <a className="text-red4">Đang đóng cửa</a>
                                       : <a className="text-blue2">Đang hoạt động</a>}
                                 </Label>
                                 <div className="grid grid-cols-4 justify-between space-x-2">
                                    <Label className="col-span-2 text-sm text-black4">
                                       Kinh độ: {place.longitude}
                                    </Label>
                                    <Label className="col-span-2 text-sm text-black4">
                                       Vĩ độ: {place.latitude}
                                    </Label>
                                 </div>
                                 <div className="grid grid-cols-5 justify-between space-x-2">
                                    <Label className="col-span-3 text-sm text-black4">
                                       Khoảng cách Check-in: {place.checkInRange} (m),
                                    </Label>
                                    <Label className="col-span-2 text-sm text-black4">
                                       Điểm Check-in: {place.checkInRange}
                                    </Label>
                                 </div>
                                 <Label className="text-sm text-black4">
                                    Link website: <a href={place.link} target="_blank" rel="noopener noreferrer" className="text-blue2 underline">{place.link}</a>
                                 </Label>
                              </SidebarGroupContent>
                           </CollapsibleContent>
                        </SidebarGroup>
                     </Collapsible>
                     <SidebarGroup>
                        <SidebarGroupLabel className="px-0">
                           <Label className="text-[20px] text-blue2" >Hình ảnh địa điểm</Label>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                           {place.placeImages && <PlaceImagesCarousel placeImages={place.placeImages} />}
                        </SidebarGroupContent>
                     </SidebarGroup>
                     <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                           <SidebarGroupLabel asChild>
                              <CollapsibleTrigger className="hover:bg-blue2o px-0 font-semibold flex">
                                 <Label className=" text-[20px] text-blue2" >Mô tả địa điểm</Label>
                                 <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </CollapsibleTrigger>
                           </SidebarGroupLabel>
                           <CollapsibleContent>
                              <SidebarGroupContent className="px-2 self-center w-full space-y-[40px]">
                                 {place.description.map((desc, index) => (
                                    <div key={index} className="flex flex-col px-2 w-full h-fit">
                                       <Label className="text-lg font-semibold text-black4">
                                          {desc.title}
                                       </Label>
                                       <Label className="text-sm text-black4">
                                          {desc.content}
                                       </Label>
                                       {desc.imageUrl && (
                                          <div className="flex w-[100px] h-[100px] relative justify-center ">
                                             <Image
                                                src={desc.imageUrl}
                                                alt="Description image"
                                                className="rounded-lg object-cover"
                                                quality={100}
                                                fill
                                             />
                                          </div>
                                       )}
                                    </div>
                                 ))}
                              </SidebarGroupContent>
                           </CollapsibleContent>
                        </SidebarGroup>
                     </Collapsible>
                  </SidebarContent>
               </Sidebar>
               <SidebarTrigger
                  className="p-[20px] [&_svg]:size-6 bg-white mt-3 rounded-full shadow-lg"
               />
            </SidebarProvider>
         }
      </>
   )
}

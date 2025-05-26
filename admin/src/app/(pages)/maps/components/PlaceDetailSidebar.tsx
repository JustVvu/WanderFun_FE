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

import { Place } from "@/models/places/place";
import placeholderImage from "@/app/assets/banner.png";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";


interface PlaceDetailSidebarProps {
   place?: Place;
   isOpen: boolean;
   setIsOpen: (value: boolean) => void;
}

export default function PlaceDetailSidebar({ place, isOpen, setIsOpen }: PlaceDetailSidebarProps) {
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
                     <div className="relative flex flex-col items-center w-full h-full">
                        <Image
                           src={place.coverImage.imageUrl ? place.coverImage.imageUrl : placeholderImage}
                           alt="Place image"
                           className="object-cover rounded-lg"
                           quality={100}
                           fill
                        />
                     </div>
                  </SidebarHeader>
                  <SidebarContent className="h-3/4 hide-scrollbar">
                     <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                           <SidebarGroupLabel asChild>
                              <CollapsibleTrigger className="flex px-0 font-semibold hover:bg-blue2o">
                                 <Label className="text-[20px] text-blue2" >Thông tin chi tiết</Label>
                                 <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </CollapsibleTrigger>
                           </SidebarGroupLabel>
                           <CollapsibleContent>
                              <SidebarGroupContent
                                 className="flex flex-col self-center w-full px-2 space-y-2"
                              >
                                 <Label className="text-lg font-semibold text-black4">
                                    {place.name}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Địa chỉ: {place.address.ward?.fullName}, {place.address.district?.fullName}, {place.address.province?.fullName}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Loại hình: {place.category.name}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Thời gian hoạt động:
                                    {(place.placeDetail.timeOpen && place.placeDetail.timeClose ? ` ${place.placeDetail.timeOpen.toString()} - ${place.placeDetail.timeClose.toString()}` : "")}
                                 </Label>
                                 <Label className="text-sm text-black4">
                                    Tình trạng: {place.placeDetail.isClosed
                                       ? <a className="text-red4">Đã đóng cửa</a>
                                       : <a className="text-blue2">Đang hoạt động</a>}
                                 </Label>
                                 <div className="grid justify-between grid-cols-4 space-x-2">
                                    <Label className="col-span-2 text-sm text-black4">
                                       Kinh độ: {place.longitude}
                                    </Label>
                                    <Label className="col-span-2 text-sm text-black4">
                                       Vĩ độ: {place.latitude}
                                    </Label>
                                 </div>
                                 <div className="grid justify-between grid-cols-5 space-x-2">
                                    <Label className="col-span-3 text-sm text-black4">
                                       Khoảng cách Check-in: {place.placeDetail.checkInRangeMeter} (m),
                                    </Label>
                                    <Label className="col-span-2 text-sm text-black4">
                                       Điểm Check-in: {place.placeDetail.checkInRangeMeter}
                                    </Label>
                                 </div>
                                 <Label className="text-sm text-black4">
                                    Link website: <a href={place.placeDetail.url} target="_blank" rel="noopener noreferrer" className="underline text-blue2">{place.placeDetail.url}</a>
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
                           {/* {place.placeImages && <PlaceImagesCarousel placeImages={place.placeImages} />} */}
                        </SidebarGroupContent>
                     </SidebarGroup>
                     <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                           <SidebarGroupLabel asChild>
                              <CollapsibleTrigger className="flex px-0 font-semibold hover:bg-blue2o">
                                 <Label className=" text-[20px] text-blue2" >Mô tả địa điểm</Label>
                                 <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </CollapsibleTrigger>
                           </SidebarGroupLabel>
                           <CollapsibleContent>
                              <SidebarGroupContent className="px-2 self-center w-full space-y-[40px]">
                                 {place.placeDetail.sectionList && place.placeDetail.sectionList.length > 0 ? (
                                    place.placeDetail.sectionList.map((sect, index) => (
                                       <div key={index} className="flex flex-col w-full px-2 h-fit">
                                          <Label className="text-lg font-semibold text-black4">
                                             {sect.title}
                                          </Label>
                                          <Label className="text-sm text-black4">
                                             {sect.content}
                                          </Label>
                                          {sect.image.imageUrl && (
                                             <div className="flex w-[100px] h-[100px] relative justify-center ">
                                                <Image
                                                   src={sect.image.imageUrl}
                                                   alt="Description image"
                                                   className="object-cover rounded-lg"
                                                   quality={100}
                                                   fill
                                                />
                                             </div>
                                          )}
                                       </div>
                                    ))
                                 ) : (
                                    <Label className="text-sm text-black4">
                                       Chưa có mô tả chi tiết cho địa điểm này.
                                    </Label>
                                 )}
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

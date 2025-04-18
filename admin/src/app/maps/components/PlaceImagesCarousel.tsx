import * as React from "react"

import {
   Carousel,
   CarouselContent,
   CarouselItem,
} from "@/components/ui/carousel"
import { NewImage } from "@/models/place"
import Image from "next/image"


export function PlaceImagesCarousel({ placeImages }: { placeImages: NewImage[] }) {
   return (
      <Carousel
         opts={{
            align: "start",
            loop: true,
         }}
         className="w-full"
      >
         <CarouselContent>
            {placeImages.map((place, index) => (
               <CarouselItem key={index} className="basis-1/2">
                  <div className="p-1">
                     <Image
                        src={place.imageUrl}
                        alt="Place image"
                        className="rounded-lg object-cover"
                        quality={100}
                        width={300}
                        height={300}
                     />
                  </div>
               </CarouselItem>
            ))}
         </CarouselContent>
      </Carousel>
   )
}

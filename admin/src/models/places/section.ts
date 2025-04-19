import { Image, ImageDTO } from "../images/image";

export interface Section {
   id: number;
   placeId: number;
   title: string;
   content: string;
   image: Image;
}

export interface SectionDTO {
   id?: number;
   placeId?: number;
   title: string;
   content: string;
   image?: ImageDTO;
}
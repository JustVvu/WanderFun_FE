import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";

export default function AddImageField() {
   const [selectedImages, setSelectedImages] = useState<File[]>([]);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      // Handle the uploaded files here
      setSelectedImages((prevImages) => [...prevImages, ...acceptedFiles]);
   }, []);

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
         "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      },
      multiple: true, // Allow multiple file uploads
   });

   const handleRemoveImage = (index: number) => {
      setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
   };

   return (
      <div className="w-full px-[40px]">
         <Label htmlFor="image">Hình ảnh của địa điểm</Label>
         <div
            {...getRootProps()}
            className={`w-[1000px] w-min-[400px] h-[140px] py-[12px] rounded-lg border-[2px] border-dashed border-black1 cursor-pointer 
               overflow-auto overscroll-x-auto}`}
         >
            <input {...getInputProps()} />
            {selectedImages.length === 0 ? (
               <div className="flex items-center justify-center h-full text-muted-foreground">

                  <span>Chọn hoặc kéo thả hình ảnh vào đây</span>

               </div>
            ) : (<div className="h-full flex flex-row px-[12px] items-center space-x-[12px]">
               {selectedImages.map((file, index) => (
                  <div
                     key={index}
                     className="relative min-w-[100px] h-[100px] flex-shrink-0"
                     onClick={(event) => event.stopPropagation()}
                  >
                     <Image
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index}`}
                        className="rounded-lg"
                        layout="fill"
                        objectFit="cover"
                     />

                     <X
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 size-[20px] bg-white bg-opacity-70 rounded-xl text-red4"
                     />

                  </div>
               ))}
            </div>
            )}
         </div>
      </div>
   );
}
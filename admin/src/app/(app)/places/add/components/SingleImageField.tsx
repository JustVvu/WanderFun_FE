import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";

interface SingleImageFieldProps {
   selectedImage: File | null;
   setSelectedImage: (file: File | null) => void;
   updateImage?: string;
}

export default function SingleImageField({ selectedImage, setSelectedImage, updateImage }: SingleImageFieldProps) {

   const onDrop = useCallback((acceptedFiles: File[]) => {
      // Handle the uploaded file here
      if (acceptedFiles.length > 0) {
         setSelectedImage(acceptedFiles[0]);
      }
   }, [setSelectedImage]);

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
         "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      },
      multiple: false, // Allow only one file upload
   });

   const handleRemoveImage = () => {
      setSelectedImage(null);
   };

   return (
      <div className="w-full">
         <Label htmlFor="image">Hình ảnh đính kèm</Label>
         <div
            {...getRootProps()}
            className={`w-[200px] h-[140px] py-[12px] px-[8px] rounded-lg border-[2px] border-dashed border-black1 cursor-pointer 
               overflow-auto overscroll-x-auto}`}
         >
            <input {...getInputProps()} />

            {!selectedImage && !updateImage ? (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-center">Chọn hoặc kéo thả hình ảnh vào đây</p>
               </div>
            ) : (
               <div className="h-full flex flex-row px-[12px] items-center space-x-[12px]">
                  {updateImage && (
                     <div
                        className="relative w-full h-full flex-shrink-0"
                        onClick={(event) => event.stopPropagation()}
                     >
                        <Image
                           src={updateImage}
                           alt="Updated image"
                           className="rounded-lg object-cover"
                           sizes="(max-width: 600px) 100vw, 50vw"
                        />
                        <X
                           onClick={handleRemoveImage}
                           className="absolute top-0 right-0 size-[20px] bg-white bg-opacity-70 rounded-xl text-red4"
                        />
                     </div>
                  )}
                  {selectedImage && (
                     <div
                        className="relative w-full h-full flex-shrink-0"
                        onClick={(event) => event.stopPropagation()}
                     >
                        <Image
                           src={URL.createObjectURL(selectedImage)}
                           alt="Selected image"
                           className="rounded-lg object-cover"
                           fill
                           sizes="(max-width: 600px) 100vw, 50vw"
                        />
                        <X
                           onClick={handleRemoveImage}
                           className="absolute top-0 right-0 size-[20px] bg-white bg-opacity-70 rounded-xl text-red4"
                        />
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
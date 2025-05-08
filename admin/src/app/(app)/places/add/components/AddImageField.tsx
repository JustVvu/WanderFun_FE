import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";

interface AddImageFieldProps {
   selectedImage: File | null;
   setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
   updateImageUrl?: string;
   label?: string;
   onExistingImageDelete?: () => void; // New callback prop
}

export default function AddImageField({
   selectedImage,
   setSelectedImage,
   updateImageUrl,
   label = "Chọn hình ảnh",
   onExistingImageDelete,
}: AddImageFieldProps) {

   const [showExistingImage, setShowExistingImage] = useState<boolean>(!!updateImageUrl);

   // Update showExistingImage when updateImageUrl prop changes
   useEffect(() => {
      setShowExistingImage(!!updateImageUrl);
   }, [updateImageUrl]);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      // Handle the uploaded file here (just take the first one)
      if (acceptedFiles.length > 0) {
         setSelectedImage(acceptedFiles[0]);
         setShowExistingImage(false);
      }
   }, [setSelectedImage]);

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
         "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      },
      multiple: false, // Allow only single file upload
   });

   const handleRemoveImage = () => {
      setSelectedImage(null);
   };

   const handleRemoveExistingImage = () => {
      setShowExistingImage(false);
      // Notify parent component that existing image is deleted
      if (onExistingImageDelete) {
         onExistingImageDelete();
      }
   };


   return (
      <div className="w-full items-center">
         <Label htmlFor="image">{label}</Label>
         <div
            {...getRootProps()}
            className={`w-[800px] w-min-[400px] h-[450px] py-[12px] rounded-lg border-[2px] border-dashed border-black1 cursor-pointer }`}
         >
            <input {...getInputProps()} />

            {!selectedImage && !updateImageUrl ? (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                  <span>Chọn hoặc kéo thả hình ảnh vào đây</span>
               </div>
            ) : (
               <div className="h-full flex flex-row px-[12px] items-center">
                  {updateImageUrl && showExistingImage && !selectedImage && (
                     <div
                        className="relative w-full h-full flex-grow"
                        onClick={(event) => event.stopPropagation()}
                     >
                        <Image
                           src={updateImageUrl}
                           alt="Updated image"
                           className="rounded-lg object-cover"
                           fill
                           sizes="(max-width: 600px) 100vw, 50vw"
                        />
                        <X
                           onClick={handleRemoveExistingImage}
                           className="absolute top-2 right-2 size-[20px] bg-white bg-opacity-70 rounded-xl text-red4 cursor-pointer"
                        />
                     </div>
                  )}

                  {selectedImage && (
                     <div
                        className="relative w-full h-full flex-grow"
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
                           className="absolute top-2 right-2 size-[20px] bg-white bg-opacity-70 rounded-xl text-red4"
                        />
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FormFieldInput } from "@/app/components/FormFieldInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlaceDescription } from '@/models/place';
import { PlusIcon } from 'lucide-react';
import SingleImageField from './SingleImageField';

interface DescriptionInputFieldProps {
   descriptions: PlaceDescription[];
   setDescriptions: React.Dispatch<React.SetStateAction<PlaceDescription[]>>;
   setDescriptionImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const DescriptionInputField: React.FC<DescriptionInputFieldProps> = (
   { descriptions, setDescriptions, setDescriptionImages },
) => {
   const [selectedImages, setSelectedImages] = useState<(File | null)[]>(descriptions.map(() => null));

   useEffect(() => {
      const images = selectedImages.filter((image): image is File => image !== null);
      setDescriptionImages(images);
   }, [selectedImages, setDescriptionImages]);

   const addDescription = () => {
      setDescriptions([...descriptions, { title: '', content: '', imageUrl: '', imagePublicId: '' }]);
      setSelectedImages([...selectedImages, null]);
   };

   const removeDescription = (index: number) => {
      setDescriptions(descriptions.filter((_, i) => i !== index));
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
   };

   const handleDescriptionChange = (index: number, field: keyof PlaceDescription, value: string) => {
      const newDescriptions = [...descriptions];
      (newDescriptions[index][field] as typeof value) = value;
      setDescriptions(newDescriptions);
   };

   const handleImageChange = (index: number, file: File | null) => {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = file;
      setSelectedImages(newSelectedImages);

      const newDescriptions = [...descriptions];
      setDescriptions(newDescriptions);
   };

   return (
      <div className="w-full px-[40px] ">
         <Label htmlFor="description">Thông tin giới thiệu</Label>
         {descriptions.map((description, index) => (
            <div key={index} className="flex flex-col space-y-[12px]">
               <FormFieldInput
                  name={`descriptions[${index}].title`}
                  //label="Tiêu đề"
                  placeholder="Nhập tiêu đề"
                  value={description.title}
                  onChange={(e) => handleDescriptionChange(index, 'title', e.target.value)}
               />
               <div className='flex flex-row space-x-[12px]'>
                  <Textarea
                     placeholder="Nhập nội dung"
                     value={description.content}
                     onChange={(e) => handleDescriptionChange(index, 'content', e.target.value)}
                     className="h-auto bg-white3 focus:bg-white focus:border-blue2 flex-grow-[3]"
                  />
                  <div className="flex-grow">
                     <SingleImageField
                        selectedImage={selectedImages[index]}
                        setSelectedImage={(file) => handleImageChange(index, file)}
                     />
                  </div>
               </div>
               <Button
                  variant="outline"
                  onClick={() => removeDescription(index)}
                  className="place-self-end w-fit hover:bg-red-200 hover:text-red3 text-red3 border-red3"
               >
                  Xóa
               </Button>
            </div>
         ))}
         <Button
            variant="outline"
            onClick={addDescription}
            type="button"
            className="w-fit mt-4 hover:bg-blue2o hover:text-blue2 border-black2"
         >
            <PlusIcon className="w-6 h-6" />
            Thêm mô tả
         </Button>
      </div>
   );
};

export default DescriptionInputField;
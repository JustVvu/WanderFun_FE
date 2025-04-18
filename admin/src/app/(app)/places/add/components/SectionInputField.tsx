import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FormFieldInput } from "@/app/components/FormFieldInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from '@/models/places/section';
import { PlusIcon } from 'lucide-react';
import SingleImageField from './SingleImageField';

interface SectionInputFieldProps {
   sections: Section[];
   setSections: React.Dispatch<React.SetStateAction<Section[]>>;
   setSectionImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const SectionInputField: React.FC<SectionInputFieldProps> = (
   { sections, setSections, setSectionImages },
) => {
   const [selectedImages, setSelectedImages] = useState<(File | null)[]>(sections.map(() => null));

   useEffect(() => {
      const images = selectedImages.filter((image): image is File => image !== null);
      setSectionImages(images);
   }, [selectedImages, setSectionImages]);

   const addSection = () => {
      setSections([...sections,
      {
         title: '',
         content: '',
         image: {
            id: 0, // Default id value
            imageUrl: '',
            imagePublicId: ''
         }
      }]);
      setSelectedImages([...selectedImages, null]);
   };

   const removeSection = (index: number) => {
      setSections(sections.filter((_, i) => i !== index));
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
   };

   const handleSectionChange = (index: number, field: keyof Section, value: string) => {
      const newSections = [...sections];
      (newSections[index][field] as typeof value) = value;
      setSections(newSections);
   };

   const handleImageChange = (index: number, file: File | null) => {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = file;
      setSelectedImages(newSelectedImages);

      const newSections = [...sections];
      setSections(newSections);
   };

   return (
      <div className="w-full px-[40px] ">
         <Label htmlFor="section">Thông tin giới thiệu</Label>
         {sections.map((section, index) => (
            <div key={index} className="flex flex-col space-y-[12px]">
               <FormFieldInput
                  name={`descriptions[${index}].title`}
                  //label="Tiêu đề"
                  placeholder="Nhập tiêu đề"
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
               />
               <div className='flex flex-row space-x-[12px]'>
                  <Textarea
                     placeholder="Nhập nội dung"
                     value={section.content}
                     onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
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
                  onClick={() => removeSection(index)}
                  className="place-self-end w-fit hover:bg-red-200 hover:text-red3 text-red3 border-red3"
               >
                  Xóa
               </Button>
            </div>
         ))}
         <Button
            variant="outline"
            onClick={addSection}
            type="button"
            className="w-fit mt-4 hover:bg-blue2o hover:text-blue2 border-black2"
         >
            <PlusIcon className="w-6 h-6" />
            Thêm mô tả
         </Button>
      </div>
   );
};

export default SectionInputField;
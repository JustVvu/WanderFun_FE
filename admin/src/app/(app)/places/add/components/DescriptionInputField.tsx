import React from 'react';
import { Button } from "@/components/ui/button";
import { FormFieldInput } from "@/app/components/FormFieldInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlaceDescription } from '@/types/place';
import { PlusIcon } from 'lucide-react';

interface DescriptionInputFieldProps {
   descriptions: PlaceDescription[];
   setDescriptions: React.Dispatch<React.SetStateAction<PlaceDescription[]>>;

}

const DescriptionInputField: React.FC<DescriptionInputFieldProps> = (
   { descriptions, setDescriptions },
) => {
   const addDescription = () => {
      setDescriptions([...descriptions, { title: '', content: '', imageUrl: '' }]);
   };

   const removeDescription = (index: number) => {
      setDescriptions(descriptions.filter((_, i) => i !== index));
   };

   const handleDescriptionChange = (index: number, field: keyof PlaceDescription, value: string) => {
      const newDescriptions = [...descriptions];
      newDescriptions[index][field] = value;
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
               <Textarea
                  placeholder="Nhập nội dung"
                  value={description.content}
                  onChange={(e) => handleDescriptionChange(index, 'content', e.target.value)}
                  className="h-[120px] bg-white3 focus:bg-white focus:border-blue2"
               />
               <FormFieldInput
                  name={`descriptions[${index}].imageUrl`}
                  //label="URL hình ảnh"
                  placeholder="Nhập URL hình ảnh"
                  value={description.imageUrl}
                  onChange={(e) => handleDescriptionChange(index, 'imageUrl', e.target.value)}
               />
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
            className="w-fit mt-4 hover:bg-blue2o hover:text-blue2 border-black2"
         >
            <PlusIcon className="w-6 h-6" />
            Thêm mô tả
         </Button>
      </div>
   );
};

export default DescriptionInputField;
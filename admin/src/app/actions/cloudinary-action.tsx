import { toast } from "sonner";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  [key: string]: unknown; // Add other properties as needed
}

export async function UploadImage(imageFiles: File[], path: string): Promise<CloudinaryResponse[]> {
  const responses: CloudinaryResponse[] = [];

  const formData = new FormData();
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('file', imageFiles[i]);
    formData.append('upload_preset', 'unsigned_preset');
    formData.append('folder', `/wanderfun/places/${path}`);
    console.log("path", path);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      responses.push(data);
    }
    catch (error) {
      toast.error('Error uploading image:' + error);

    }
  }
  return responses;
};

export async function DeleteImage(publicId: string): Promise<void> {
  try {
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      }
    );
  }
  catch (error) {
    toast.error('Error deleting image:' + error);
  }
}
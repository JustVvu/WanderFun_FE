import { toast } from "sonner";
import crypto from "crypto";


const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ''
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || ''

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  [key: string]: unknown; // Add other properties as needed
}

const generateSHA1 = (data: string) => {
  const hash = crypto.createHash("sha1");
  hash.update(data);
  return hash.digest("hex");
}

const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

function normalizedPath(path: string): string {
  return path.replace(/\s/g, '').replace(/_/g, '').toLowerCase();
}

export async function UploadImage(imageFile: File, path: string): Promise<CloudinaryResponse | null> {
  path = normalizedPath(path);

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'unsigned_preset');
  formData.append('folder', `/wanderfun/places/${path}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  }
  catch (error) {
    toast.error('Error uploading image: ' + error);
    return null;
  }
}

export async function UploadImages(imageFiles: File[], path: string): Promise<CloudinaryResponse[]> {
  const responses: CloudinaryResponse[] = [];

  path = normalizedPath(path);

  const formData = new FormData();
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('file', imageFiles[i]);
    formData.append('upload_preset', 'unsigned_preset');
    formData.append('folder', `/wanderfun/places/${path}`);
    //console.log("path", path);
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
  const timestamp = new Date().getTime();
  const signature = generateSHA1(generateSignature(publicId, apiSecret));
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", apiKey.toString());
  formData.append("timestamp", timestamp.toString())
  try {
    console.log("formData", formData);
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          signature: signature,
          api_key: apiKey,
          timestamp: timestamp,
        }),
      }
    );
  }
  catch (error) {
    toast.error('Error deleting image:' + error);
  }
}
import imageCompression from 'browser-image-compression';
import { useState } from 'react';
import { UseUploadImageType } from '@/types/services.types';

export default function useUploadImage(
  maxAcceptedSizeMB: number,
  maxCompressedSizeMB: number,
  maxWidthOrHeight: number
): UseUploadImageType {
  const [image, setImage] = useState<File | null>(null);
  const [warning, setWarning] = useState<string>('');

  const onFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length === 1) {
      const file: File = event.target.files[0];

      if (file.size <= maxAcceptedSizeMB * 1024 * 1024) {
        const options = {
          maxSizeMB: maxCompressedSizeMB,
          maxWidthOrHeight: maxWidthOrHeight,
          fileType: 'image/png',
          useWebWorker: true,
          initialQuality: 0.9,
        };

        try {
          const compressedImage = await imageCompression(file, options);
          setImage(compressedImage);
        } catch (error) {
          setWarning('There was an error compressing the image.');
        }
      } else {
        setWarning(
          `Please upload an image that is ${maxAcceptedSizeMB}MB or smaller.`
        );
      }
    }
  };

  return { image, warning, onFileInputChange };
}

import imageCompression from 'browser-image-compression';
import { useState } from 'react';

type UseUploadImageType = {
  image: File | null;
  warning: string;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function useUploadImage(
  maxAcceptedSizeMB: number,
  maxComporessedSizeMB: number,
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
          maxSizeMB: maxComporessedSizeMB,
          maxWidthOrHeight: maxWidthOrHeight,
          fileType: 'img/png',
          useWebWorker: true,
        };
        const compressedImage = await imageCompression(file, options);
        setImage(compressedImage);
      } else {
        setWarning(
          `Please upload an image that is ${maxAcceptedSizeMB}MB or smaller.`
        );
      }
    }
  };

  return { image, warning, onFileInputChange };
}

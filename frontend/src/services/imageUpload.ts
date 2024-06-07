import { storage } from '@/auth/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (image: Blob, eventName: string) => {
  try {
    let url = '';
    if (image != null) {
      const imageRef = ref(storage, `events/${eventName}+${uuidv4()}`);
      const imageToUpload = image!;

      await uploadBytes(imageRef, imageToUpload).then((response) => {
        return getDownloadURL(response.ref).then((res) => {
          return (url = res);
        });
      });
      return url;
    } else {
      return (url = `${process.env.NEXT_PUBLIC_URL_EVENT_IMAGE_DEFAULT}`);
    }
  } catch (error) {
    throw error;
  }
};

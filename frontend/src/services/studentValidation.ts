import axios from 'axios';
import { checkedIdResponse } from '@/types/types';

export const checkPasswords = (
  password: string,
  confirmPassword: string
): boolean => password === confirmPassword;

export const studentValidation = async (
  email: string,
  studentId: string
): Promise<checkedIdResponse> => {
  const getCheck = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/checkStudentId`,
    { email, studentId },
    {
      headers: { 'content-type': 'application/json' },
    }
  );

  const checked = await getCheck.data;

  return checked;
};

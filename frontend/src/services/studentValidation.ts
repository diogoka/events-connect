import axios from 'axios';
import { checkedIdResponse } from '@/types/services.types';

export const checkPasswords = (
  password: string,
  confirmPassword: string
): boolean => password === confirmPassword;

export const studentValidation = async (
  email: string,
  studentId: number
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

export const getStudentId = async (email: string): Promise<number> => {
  const studentId = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/getId`,
    { email },
    {
      headers: { 'content-type': 'application/json' },
    }
  );

  const id = await studentId.data;

  return id;
};

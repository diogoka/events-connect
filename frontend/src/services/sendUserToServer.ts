import { UserInputDTO } from '@/types/pages.types';
import axios from 'axios';

export const sendUserToServer = async (user: UserInputDTO) => {
  console.log('input', user);
  const newUser = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
    user,
    {
      headers: { 'content-type': 'application/json' },
    }
  );

  const response = newUser.data;

  return response;
};

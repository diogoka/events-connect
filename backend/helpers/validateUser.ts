import { UserInput } from '../types/types';

export const validateUserInput = (
  userInput: UserInput
): {
  result: boolean;
  message: string;
} => {
  let result = false;
  let message = '';

  if (!userInput.id) {
    message = 'Invalid user ID';
  } else if (isNaN(userInput.type)) {
    message = 'Invalid User Type';
  } else if (isNaN(userInput.courseId)) {
    message = 'Invalid Course ID';
  } else if (!/^[^@]+@[^.]+\..+$/.test(userInput.email)) {
    message = 'Invalid Email';
  } else if (
    userInput.postalCode &&
    !/^[A-Za-z0-9]{3}[-\s]?[A-Za-z0-9]{3}$/.test(userInput.postalCode)
  ) {
    message = 'Invalid Postal Code';
  } else if (userInput.phone && !/^[0-9-]+$/.test(userInput.phone)) {
    message = 'Invalid Phone Number';
  } else {
    result = true;
  }

  return {
    result,
    message,
  };
};

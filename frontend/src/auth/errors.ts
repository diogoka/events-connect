export const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password';
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long';
    default:
      return 'Unexpected error. Please contact admin.';
  }
}
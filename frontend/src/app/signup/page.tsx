'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useTheme,
  useMediaQuery,
  Stack,
  TextField,
  Typography,
  Button,
  FormControl,
  Box,
} from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { LoginStatus, UserContext } from '@/context/userContext';
import { getErrorMessage } from '@/auth/errors';
import PasswordInput from '@/components/common/password-input';
import NumberTextFieldInput from '@/components/common/noArrowsTextField';

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import {
  studentValidation,
  checkPasswords,
} from '@/services/studentValidation';

export default function SignUpPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const router = useRouter();

  const theme = useTheme();

  const { setFirebaseAccount, loginStatus, setLoginStatus } =
    useContext(UserContext);

  // User Input
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [studentId, setStudentID] = useState<string>('');

  // Alert Message
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (loginStatus === 'Logged In') {
      router.replace('/events');
    }
    if (loginStatus === 'Singing Up') {
      router.replace('/signup/register');
    }
  }, [loginStatus]);

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isPasswordMatch = checkPasswords(password, confirmPassword);

    if (!isPasswordMatch) {
      //eslint-disable-next-line
      setAlertMessage("Password and Confirm Password doesn't match.");
      return;
    }

    const checkStudentID = await studentValidation(email, studentId);

    if (!checkStudentID.checked) {
      setAlertMessage(checkStudentID.message!);

      return;
    } else {
      createUserWithEmailAndPassword(getAuth(), email, password)
        .then((result) => {
          setFirebaseAccount(result.user);
          setLoginStatus(LoginStatus.SigningUp);
          router.replace('/signup/register');
        })
        .catch((error: any) => {
          setAlertMessage(getErrorMessage(error.code));
        });
    }
  };

  const handleGoogleAuth = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount(result.user);
        setLoginStatus(LoginStatus.SigningUp);
        router.replace('/signup/register');
      })
      .catch((error: any) => {
        setFirebaseAccount(null);
        setAlertMessage(getErrorMessage(error.code));
      });
  };

  return (
    <>
      {!isMobile && (
        <Box
          width='100%'
          height='calc(100vh - 4rem)'
          position='absolute'
          sx={{
            inset: '4rem auto auto 0',
            backgroundImage: 'url("/auth-bg.png")',
            backgroundSize: 'cover',
            backgroundPositionX: '50%',
          }}
        ></Box>
      )}

      <Box
        bgcolor='white'
        width={isMobile ? 'auto' : '50%'}
        height={isMobile ? 'auto' : '100vh'}
        minWidth={isMobile ? 'auto' : '560px'}
        maxWidth={isMobile ? '345px' : '960px'}
        marginInline='auto'
        sx={{
          position: isMobile ? 'static' : 'fixed',
          inset: '4rem 0 auto auto',
        }}
      >
        <Stack
          maxWidth={isMobile ? 'auto' : '600px'}
          marginTop={isMobile ? '2rem' : 0}
          marginInline='auto'
          padding={isMobile ? 'none' : '0 6rem 2rem 6rem'}
        >
          {!isMobile && (
            <Typography
              marginBlock={isMobile ? 'none' : '2rem'}
              variant='h1'
              fontWeight='bold'
            >
              Sign Up
            </Typography>
          )}

          {/* Step1: Firebase Authentication */}
          {loginStatus === LoginStatus.LoggedOut && (
            <Stack rowGap={'20px'}>
              <form onSubmit={handleEmailAuth}>
                <Stack rowGap={'20px'}>
                  <Stack rowGap={'10px'}>
                    <FormControl required>
                      <TextField
                        type='email'
                        label='Email'
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl required>
                      <PasswordInput label='Password' setter={setPassword} />
                    </FormControl>
                    <FormControl required>
                      <PasswordInput
                        label='Confirm Password'
                        setter={setConfirmPassword}
                      />
                    </FormControl>
                    <FormControl required>
                      <NumberTextFieldInput
                        label={'Student ID'}
                        maxLength={6}
                        setStudentID={setStudentID}
                      />
                    </FormControl>
                    <Typography color='error'>{alertMessage}</Typography>
                  </Stack>

                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                  >
                    Next
                  </Button>
                </Stack>
              </form>

              <Typography align='center'>or</Typography>
              <Button
                variant='outlined'
                color='secondary'
                startIcon={<FcGoogle />}
                onClick={handleGoogleAuth}
                sx={{
                  borderColor: theme.palette.secondary.light,
                }}
              >
                Sign up with Google
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
}

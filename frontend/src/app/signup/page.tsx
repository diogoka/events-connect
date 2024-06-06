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
import { UserContext } from '@/context/userContext';
import { LoginStatus } from '@/types/context.types';
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
import { RegisterMessage } from '@/types/alert.types';
import Background from '@/components/registering/background';

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

  const [registerMessage, setRegisterMessage] = useState<RegisterMessage>({
    showMessage: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    if (loginStatus === 'Logged In') {
      router.replace('/events');
    }
    if (loginStatus === 'Singing Up') {
      router.replace('/signup/register');
    }
  }, [loginStatus]);

  const handleMessage = (
    messageToShow: RegisterMessage,
    time: number,
    navigate?: string
  ) => {
    setRegisterMessage({
      showMessage: messageToShow.showMessage,
      message: messageToShow.message,
      severity: messageToShow.severity,
    });

    setTimeout(() => {
      setRegisterMessage({
        showMessage: false,
        message: '',
        severity: 'info',
      });
      if (navigate) {
        router.replace(navigate);
      }
    }, time * 1000);
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isPasswordMatch = checkPasswords(password, confirmPassword);

    if (!isPasswordMatch) {
      handleMessage(
        {
          showMessage: true,
          message: 'Passwords does not match.',
          severity: 'error',
        },
        6
      );

      return;
    }

    const checkStudentID = await studentValidation(email, studentId);

    if (!checkStudentID.checked) {
      handleMessage(
        {
          showMessage: true,
          message: `${checkStudentID.message}`,
          severity: 'error',
        },
        6
      );

      return;
    } else {
      createUserWithEmailAndPassword(getAuth(), email, password)
        .then((result) => {
          setFirebaseAccount({
            uid: result.user.uid,
            email: result.user.email,
            providerData: result.user.providerData,
            studentId: studentId,
          });

          setLoginStatus(LoginStatus.SigningUp);
          router.replace('/signup/register');
        })
        .catch((error: any) => {
          handleMessage(
            {
              showMessage: true,
              message: `${getErrorMessage(error.code)}`,
              severity: 'error',
            },
            7
          );
        });
    }
  };

  const handleGoogleAuth = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount({
          uid: result.user.uid,
          email: result.user.email,
          providerData: result.user.providerData,
          studentId: studentId,
          photoURL: result.user.photoURL,
        });
        setLoginStatus(LoginStatus.SigningUp);
        router.replace('/signup/register');
      })
      .catch((error: any) => {
        setFirebaseAccount(null);
        handleMessage(
          {
            showMessage: true,
            message: `${getErrorMessage(error.code)}`,
            severity: 'error',
          },
          6
        );
      });
  };

  return (
    <>
      {!isMobile && <Background registerMessage={registerMessage} />}

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

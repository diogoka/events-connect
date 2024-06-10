'use client';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import {
  useTheme,
  Stack,
  TextField,
  Typography,
  Button,
  FormControl,
  Container,
  Box,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import PasswordInput from '@/components/common/password-input';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getErrorMessage } from '@/auth/errors';
import { UserContext } from '@/context/userContext';
import { LoginStatus } from '@/types/context.types';
import { EventContext } from '@/context/eventContext';
import PasswordResetModal from '@/components/login/password-reset-modal';
import { ErrorMessage } from '../../types/types';

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const route = useRouter();

  const theme = useTheme();

  const { setUser, setFirebaseAccount, setLoginStatus, firebaseAccount } =
    useContext(UserContext);

  const { pathName, setShowedPage } = useContext(EventContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [userServerError, setUserServerError] = useState<ErrorMessage>({
    error: false,
    message: '',
  });

  const getUserFromServer = (uid: string, provider: string) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${uid}`)
      .then((res: any) => {
        console.log('res', res.data);

        setUser(res.data);
        setFirebaseAccount((prevState) => {
          console.log('prevState', prevState);

          return {
            ...prevState!,
            studentId: res.data.student_id!,
          };
        });

        setLoginStatus(LoginStatus.LoggedIn);
        route.replace('/events');
      })
      .catch((error: any) => {
        console.log('provider', provider);

        if (
          error.response.data === 'You need to finish the registration.' &&
          provider === 'password'
        ) {
          console.log('I need to send the user to registration');

          setUserServerError({
            error: true,
            message:
              'You need to finish the registration. You are being redirected to finish it.',
          });

          setTimeout(() => {
            setLoginStatus(LoginStatus.SigningUp);
            route.replace('/signup/register');
          }, 8000);
        } else {
          signOut(getAuth());
          setFirebaseAccount(null);
          setUser(null);
          setLoginStatus(LoginStatus.LoggedOut);
          handleSetUserServerError(
            { error: true, message: error.response.data },
            6
          );
        }
      });
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((result) => {
        setFirebaseAccount({
          uid: result.user.uid,
          email: result.user.email,
          providerData: result.user.providerData,
          studentId: '',
        });
        getUserFromServer(
          result.user.uid,
          result.user.providerData[0].providerId
        );
      })
      .catch((error) => {
        handleSetUserServerError(
          { error: true, message: getErrorMessage(error.code) },
          6
        );
      });

    if (pathName === '/login') {
      setShowedPage({
        label: 'Events',
        path: '/',
      });
    }
  };

  const handleSetUserServerError = (
    errorObject: ErrorMessage,
    seconds: number
  ): void => {
    setUserServerError({
      error: errorObject.error,
      message: errorObject.message,
    });

    setTimeout(() => {
      setUserServerError({
        error: false,
        message: '',
      });
    }, seconds * 1000);
  };

  const handleGoogleLogin = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount({
          uid: result.user.uid,
          email: result.user.email,
          providerData: result.user.providerData,
          studentId: '',
          photoURL: result.user.photoURL,
        });
        getUserFromServer(
          result.user.uid,
          result.user.providerData[0].providerId
        );
      })
      .catch((error) => {
        handleSetUserServerError(
          { error: true, message: getErrorMessage(error.code) },
          6
        );
      });

    if (pathName === '/login') {
      setShowedPage({
        label: 'Events',
        path: '/',
      });
    }
  };

  return (
    <>
      {!isMobile && (
        <Box
          width='100vw'
          height='100vh'
          position='absolute'
          sx={{
            inset: '0 auto auto 0',
            backgroundImage: 'url("/auth-bg.png")',
            backgroundSize: 'cover',
          }}
        >
          {userServerError.error && (
            <Alert sx={{ width: '28%', margin: '5%' }} severity='error'>
              {userServerError.message}
            </Alert>
          )}
        </Box>
      )}

      <Stack
        width={isMobile ? 'auto' : '600px'}
        maxWidth={isMobile ? '345px' : 'auto'}
        marginInline='auto'
        padding={isMobile ? 'none' : '2rem 6rem'}
        borderRadius='0.75rem'
        bgcolor='white'
        zIndex={100}
        sx={{
          position: isMobile ? 'static' : 'absolute',
          inset: isMobile ? '0' : '50% auto auto 50%',
          transform: isMobile ? '' : 'translate(-50%, -50%)',
        }}
      >
        <Container
          sx={{
            width: 'auto',
            margin: 'auto',
            padding: '0rem 2rem 2rem',
          }}
        >
          <Image
            src='/cornestone-connect-logo-blue-wide.png'
            width={isMobile ? 267.4 : 305.6}
            height={isMobile ? 70 : 80}
            alt='logo'
            priority
          />
        </Container>
        <Stack rowGap={'20px'}>
          <form onSubmit={handleEmailLogin}>
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
                <Typography
                  onClick={() => {
                    setIsPasswordReset(true);
                  }}
                  color={theme.palette.info.main}
                  sx={{
                    textAlign: 'right',
                    cursor: 'pointer',
                  }}
                >
                  Forgot password?
                </Typography>
                <PasswordResetModal
                  isPasswordReset={isPasswordReset}
                  setIsPasswordReset={setIsPasswordReset}
                />
              </Stack>

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Log In
              </Button>
            </Stack>
          </form>

          <Button
            variant='outlined'
            color='secondary'
            startIcon={<FcGoogle />}
            onClick={handleGoogleLogin}
            sx={{
              borderColor: theme.palette.secondary.light,
            }}
          >
            Log in with Google
          </Button>

          <Typography align='center'>or</Typography>

          <Button
            onClick={() => route.push('/signup')}
            variant='contained'
            color='primary'
            fullWidth
          >
            Sign Up
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

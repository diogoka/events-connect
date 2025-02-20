'use client';
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { ResendEmailModal } from '@/components/login/resend-email-modal';
import { useSnack } from '@/context/snackContext';

import { api } from '@/services/api';
import FadeSkeleton from '@/components/common/fadeSkeleton';

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const route = useRouter();

  const theme = useTheme();

  const { setUser, setFirebaseAccount, setLoginStatus } =
    useContext(UserContext);

  const { pathName, setShowedPage } = useContext(EventContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [resendVerificationEmail, setResendVerificationEmail] = useState(false);

  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const handleBackgroundLoad = () => setBackgroundLoaded(true);

  const { openSnackbar } = useSnack();

  const getUserFromServer = async (
    uid: string,
    provider: string,
    email: string
  ) => {
    try {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${uid}`,
        { provider, email },
        { headers: { 'Content-type': 'application/json' } }
      );
      setUser(response.data);
      setFirebaseAccount((prevState) => {
        return {
          ...prevState!,
          uid: response.data.id_user,
          studentId: response.data.student_id!,
        };
      });
      setLoginStatus(LoginStatus.LoggedIn);
      route.replace('/events');
    } catch (error: any) {
      openSnackbar(error.response.data, 'error');
      signOut(getAuth());
      setFirebaseAccount(null);
      setUser(null);
      setLoginStatus(LoginStatus.LoggedOut);
    }
  };

  const handleSignUpGoogle = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount({
          uid: result.user.uid,
          email: result.user.email,
          providerData: result.user.providerData,
          studentId: 0,
          photoURL: result.user.photoURL,
        });
        setLoginStatus(LoginStatus.LoggedOut);
        route.replace('/signup/');
      })
      .catch((error: any) => {
        setFirebaseAccount(null);
        openSnackbar(getErrorMessage(error.code), 'error');
      });
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && password) {
      signInWithEmailAndPassword(getAuth(), email, password)
        .then((result) => {
          setFirebaseAccount({
            uid: result.user.uid,
            email: result.user.email,
            providerData: result.user.providerData,
            studentId: 0,
          });
          getUserFromServer(
            result.user.uid,
            result.user.providerData[0].providerId,
            result.user.email!
          );
        })
        .catch((error) => {
          openSnackbar(getErrorMessage(error.code), 'error');
        });

      if (pathName === '/login') {
        setShowedPage({
          label: 'Events',
          path: '/',
        });
      }
    }
  };

  const handleGoogleLogin = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount({
          uid: result.user.uid,
          email: result.user.email,
          providerData: result.user.providerData,
          studentId: 0,
          photoURL: result.user.photoURL,
        });
        getUserFromServer(
          result.user.uid,
          result.user.providerData[0].providerId,
          result.user.email!
        );
      })
      .catch((error) => {
        openSnackbar(`Something went wrong. ${error}`, 'warning');
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
      <Box
        sx={{
          width: '100vw',
          height: isMobile ? '100%' : '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {!backgroundLoaded && (
          <FadeSkeleton
            variant='rectangular'
            width='100%'
            height='100%'
            animation='wave'
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          />
        )}
        <Box
          component='img'
          src='/auth-bg.png'
          onLoad={handleBackgroundLoad}
          sx={{
            display: isMobile || backgroundLoaded ? 'block' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <Stack
          width={isMobile ? 'auto' : '600px'}
          marginInline='auto'
          padding={isMobile ? '5rem 2rem' : '3rem 6rem'}
          borderRadius='0.75rem'
          zIndex={100}
          sx={{
            display: 'flex',
            backgroundColor: '#FBF8FF',
          }}
        >
          <Container
            sx={{
              width: 'auto',
              margin: 'auto',
              padding: '0rem 2rem 2rem',
              display: 'flex',
            }}
          >
            <Image
              src='/cornestone-connect-logo-blue-wide.png'
              width={744}
              height={153}
              alt='logo'
              priority
              style={{ width: '80%', height: 'auto', margin: 'auto' }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover fieldset': {
                            border: 'none',
                          },
                          '&.Mui-focused fieldset': {
                            border: 'none',
                          },
                        },
                        backgroundColor: '#F5F2FA',
                        borderRadius: '6px',
                      }}
                    />
                  </FormControl>
                  <FormControl required>
                    <PasswordInput
                      label='Password'
                      setPassword={setPassword}
                      setter={setPassword}
                      type='password'
                      local='login'
                      disabled={false}
                    />
                  </FormControl>
                  <Typography
                    onClick={() => {
                      setIsPasswordReset(true);
                    }}
                    color={theme.palette.primary.dark}
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
                  Login
                </Button>
              </Stack>
            </form>

            <Button
              color='secondary'
              startIcon={<FcGoogle />}
              onClick={handleGoogleLogin}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
                backgroundColor: '#F5F2FA',
                borderRadius: '6px',
              }}
            >
              Log in with Google
            </Button>

            <Typography align='center'>or</Typography>

            <Box sx={{ display: 'flex', gap: '1.1rem' }}>
              <Button
                onClick={handleSignUpGoogle}
                color='secondary'
                endIcon={<FcGoogle />}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                  backgroundColor: '#F5F2FA',
                  borderRadius: '6px',
                }}
              >
                Sign Up
              </Button>
              <Button
                onClick={() => route.push('/signup')}
                variant='contained'
                color='primary'
                fullWidth
              >
                Sign Up
              </Button>
            </Box>
            <Typography
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
                display: 'flex',
                fontSize: isMobile ? '11px' : '13px',
              }}
            >
              If you haven’t received the verification email, click{' '}
              <Typography
                onClick={() => {
                  setResendVerificationEmail(true);
                }}
                color={theme.palette.primary.dark}
                sx={{
                  cursor: 'pointer',
                  marginLeft: '2px',
                  fontSize: isMobile ? '11px' : '13px',
                }}
              >
                here.
              </Typography>
              <ResendEmailModal
                isOpen={resendVerificationEmail}
                handleClose={setResendVerificationEmail}
              />
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

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
} from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import PasswordInput from '@/components/common/password-input';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getErrorMessage } from '@/auth/errors';
import { UserContext, LoginStatus } from '@/context/userContext';
import { EventContext } from '@/context/eventContext';
import PasswordResetModal from '@/components/login/password-reset-modal';
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const route = useRouter();

  const theme = useTheme();

  const { setUser, setFirebaseAccount, setLoginStatus } =
    useContext(UserContext);

  const { pathName, setShowedPage } = useContext(EventContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Alert Message
  const [alertMessage, setAlertMessage] = useState('');

  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const getUserFromServer = (uid: string) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${uid}`)
      .then((res: any) => {
        setUser(res.data);
        setLoginStatus(LoginStatus.LoggedIn);
        route.replace('/events');
      })
      .catch((error: any) => {
        setUser(null);
        setLoginStatus(LoginStatus.SigningUp);
      });
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((result) => {
        setFirebaseAccount(result.user);
        getUserFromServer(result.user.uid);
      })
      .catch((error) => {
        setAlertMessage(getErrorMessage(error.code));
      });

    if (pathName === '/login') {
      setShowedPage({
        label: 'Events',
        path: '/',
      });
    }
  };

  const handleGoogleLogin = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount(result.user);
        getUserFromServer(result.user.uid);
      })
      .catch((error) => {
        setAlertMessage(getErrorMessage(error.code));
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
        ></Box>
      )}
      <Stack
        width={isMobile ? 'auto' : '600px'}
        maxWidth={isMobile ? '345px' : 'auto'}
        marginInline='auto'
        padding={isMobile ? 'none' : '0 6rem 2rem 6rem'}
        borderRadius='0.75rem'
        bgcolor='white'
        zIndex={100}
        sx={{
          position: isMobile ? 'static' : 'absolute',
          inset: isMobile ? '0' : '50% auto auto 50%',
          transform: isMobile ? '' : 'translate(-50%, -50%)',
        }}
      >
        <Container sx={{ width: 'auto', margin: 'auto', paddingBlock: '2rem' }}>
          <Image
            src='/eventllege_logo.svg'
            width={170}
            height={108}
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
                  <Typography color='error'>{alertMessage}</Typography>
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

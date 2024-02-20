'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
import NameInput from '@/components/user/form/name-input';
import CourseInput from '@/components/user/form/course-input';
import { User } from '@/types/types';
import { updateFirstName, updateLastName } from '@/common/functions';

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function SignUpPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const router = useRouter();

  const theme = useTheme();

  const {
    setUser,
    firebaseAccount,
    setFirebaseAccount,
    loginStatus,
    setLoginStatus,
  } = useContext(UserContext);

  // User Input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState<User>({
    firstName: '',
    lastName: '',
  });
  const [courseId, setCourseId] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Alert Message
  const [alertMessage, setAlertMessage] = useState('');

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === confirmPassword) {
      createUserWithEmailAndPassword(getAuth(), email, password)
        .then((result) => {
          setFirebaseAccount(result.user);
          setLoginStatus(LoginStatus.SigningUp);
        })
        .catch((error: any) => {
          setAlertMessage(getErrorMessage(error.code));
        });
    } else {
      //eslint-disable-next-line
      setAlertMessage("Password and Confirm Password doesn't match");
    }
  };

  const handleGoogleAuth = async () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setFirebaseAccount(result.user);
        setLoginStatus(LoginStatus.SigningUp);
      })
      .catch((error: any) => {
        setFirebaseAccount(null);
        setAlertMessage(getErrorMessage(error.code));
      });
  };

  // Send user info to our server
  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firebaseAccount) {
      console.error('No firebase account');
      return;
    }

    const formData = new FormData();
    formData.append('id', firebaseAccount.uid);
    formData.append('email', firebaseAccount.email!);
    formData.append('type', '2');
    formData.append('courseId', courseId.toString());
    formData.append('firstName', userName.firstName);
    formData.append('lastName', userName.lastName);
    formData.append('provider', firebaseAccount.providerData![0].providerId);
    formData.append('avatarURL', firebaseAccount.photoURL!);

    if (postalCode) formData.append('postalCode', postalCode);
    if (phone) formData.append('phone', phone);

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, formData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        setUser(res.data);
        setLoginStatus(LoginStatus.LoggedIn);
        router.replace('/events');
      })
      .catch((error) => {
        console.error(error.response.data);
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

          {/* Step2: Register for our app */}
          {loginStatus === LoginStatus.SigningUp && (
            <form onSubmit={handleSignup}>
              <Stack rowGap={'20px'}>
                <Stack rowGap={'10px'}>
                  <NameInput
                    name={userName.firstName}
                    setName={updateFirstName}
                    setUserName={setUserName}
                    label='First Name'
                  />
                  <NameInput
                    name={userName.lastName}
                    setName={updateLastName}
                    setUserName={setUserName}
                    label='Last Name'
                  />
                  <CourseInput courseId={courseId} setCourseId={setCourseId} />

                  <Typography variant='body2' align='center'>
                    If you are an instructor, please contact admin.
                  </Typography>
                </Stack>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                >
                  Register
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Box>
    </>
  );
}

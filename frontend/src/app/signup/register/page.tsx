'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  useMediaQuery,
  Stack,
  Typography,
  Button,
  Box,
  Checkbox,
  Link,
} from '@mui/material';

import { UserContext } from '@/context/userContext';
import { LoginStatus } from '@/types/context.types';

import NameInput from '@/components/user/form/name-input';
import CourseInput from '@/components/user/form/course-input';
import { User } from '@/types/pages.types';
import { RegisterMessage } from '@/types/alert.types';
import { updateFirstName, updateLastName } from '@/common/functions';

import ModalAgreement from '@/components/login/modal-agreement';
import NumberTextFieldInput from '@/components/common/noArrowsTextField';
import { studentValidation, getStudentId } from '@/services/studentValidation';

import { deleteAccount } from '@/auth/auth-provider';
import { signOut, getAuth } from 'firebase/auth';
import Background from '@/components/registering/background';

export default function RegisterPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const router = useRouter();

  const {
    setUser,
    firebaseAccount,
    loginStatus,
    setLoginStatus,
    setFirebaseAccount,
    user,
    error,
    setError,
  } = useContext(UserContext);

  // User Input
  const [userName, setUserName] = useState<User>({
    firstName: '',
    lastName: '',
  });

  const [courseId, setCourseId] = useState<string>('');
  const [postalCode] = useState<string>('');
  const [phone] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);

  //Modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);
  const [studentId, setStudentID] = useState<string>('');
  const [registerMessage, setRegisterMessage] = useState<RegisterMessage>({
    showMessage: false,
    message: '',
    severity: 'info',
  });

  const isGoogle =
    firebaseAccount?.providerData?.[0]?.providerId === 'google.com';

  useEffect(() => {
    if (!firebaseAccount) {
      router.replace('/signup');
    }
  }, []);

  const clearState = () => {
    setUserName({
      firstName: '',
      lastName: '',
    });
    setCourseId('');
  };

  const handleChangeCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.preventDefault();
    checked ? setChecked(false) : setChecked(true);
  };

  const handleGoogleAuth = async () => {
    const checkStudentID = await studentValidation(
      firebaseAccount!.email!,
      studentId
    );

    if (!checkStudentID.checked) {
      //Means error
      handleCheckError(checkStudentID.code!, checkStudentID.message!);
    } else {
      await sendUserToServer();
    }
  };

  const handleCheckError = async (code: number, message: string) => {
    //code 3 is email is not in the class365

    if (code === 3) {
      await deleteAccount();
      setFirebaseAccount(null);
      setLoginStatus(LoginStatus.LoggedOut);
      handleMessage(
        {
          showMessage: true,
          message: `${message}. You are being redirected to Sign up. \n Please, select a different email.`,
          severity: 'error',
        },
        7,
        '/signup'
      );
    } else {
      handleMessage(
        { showMessage: true, message: message, severity: 'error' },
        5
      );
    }
  };

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
      setRegisterMessage({ showMessage: false, message: '', severity: 'info' });
      if (navigate) {
        router.replace(navigate);
      }
    }, time * 1000);
  };

  const sendUserToServer = async () => {
    const formData = new FormData();
    formData.append('id', firebaseAccount!.uid);
    formData.append('email', firebaseAccount!.email!);
    formData.append('type', '2');
    formData.append('courseId', courseId.toString());
    formData.append('firstName', userName.firstName);
    formData.append('lastName', userName.lastName);
    formData.append('provider', firebaseAccount!.providerData![0].providerId);
    formData.append('avatarURL', firebaseAccount!.photoURL!);
    formData.append('is_verified', 'false');

    if (
      firebaseAccount?.providerData![0].providerId === 'password' &&
      firebaseAccount.studentId === ''
    ) {
      const id = await getStudentId(firebaseAccount!.email!);
      formData.append('student_id', id.toString());
    } else {
      formData.append(
        'student_id',
        firebaseAccount?.studentId ? firebaseAccount.studentId : studentId
      );
    }

    if (postalCode) formData.append('postalCode', postalCode);
    if (phone) formData.append('phone', phone);

    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, formData, {
        headers: { 'content-type': 'application/json' },
      })
      .then((res) => {
        handleMessage(
          {
            showMessage: true,
            message: `${res.data} Please verify your email.`,
            severity: 'success',
          },
          6,
          '/login'
        );
        setError({
          error: true,
          message: 'User created. Please check your email.',
        });

        clearState();
        setFirebaseAccount(null);
        setLoginStatus(LoginStatus.LoggedOut);
        signOut(getAuth());
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  //Handle different type of sign up
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firebaseAccount) {
      console.error('No firebase account');
      return;
    }
    if (!isGoogle) {
      sendUserToServer();
    } else {
      handleGoogleAuth();
    }
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
              Finish Registration
            </Typography>
          )}

          {/* Step2: Register for our app */}

          <form onSubmit={handleSignUp}>
            <Stack rowGap={'20px'}>
              <Stack rowGap={'10px'}>
                <NameInput
                  name={userName.firstName}
                  setName={updateFirstName}
                  setUserName={setUserName}
                  label='First Name'
                  disable={registerMessage.showMessage}
                />
                <NameInput
                  name={userName.lastName}
                  setName={updateLastName}
                  setUserName={setUserName}
                  label='Last Name'
                  disable={registerMessage.showMessage}
                />
                <CourseInput
                  courseId={courseId}
                  setCourseId={setCourseId}
                  disable={registerMessage.showMessage}
                />

                {isGoogle && (
                  <NumberTextFieldInput
                    label={'Student ID'}
                    maxLength={6}
                    setStudentID={setStudentID}
                    disable={registerMessage.showMessage}
                  />
                )}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={checked}
                    onChange={handleChangeCheckBox}
                    sx={{
                      padding: '0',
                    }}
                    disabled={registerMessage.showMessage}
                  />
                  <Typography sx={{ fontSize: '15px', lineHeight: '2rem' }}>
                    I acknowledge that I have read and understood the
                    <Link
                      type='button'
                      component='button'
                      sx={{
                        '&:hover': {
                          cursor: 'pointer',
                        },
                        ':disabled:hover': {
                          cursor: 'auto',
                        },
                        marginLeft: '3px',
                        fontSize: '15px',
                      }}
                      onClick={handleOpen}
                      disabled={registerMessage.showMessage}
                    >
                      {' '}
                      Terms and Conditions.
                    </Link>
                  </Typography>
                </Box>
              </Stack>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                disabled={!checked}
                sx={{
                  '&:disabled': {
                    cursor: 'not-allowed',
                    pointerEvents: 'auto',
                  },
                }}
              >
                Register
              </Button>

              <Typography variant='body2' align='center'>
                If you are an organizer, please contact admin:{' '}
                head.tech@ciccc.ca
              </Typography>
            </Stack>
          </form>
        </Stack>
      </Box>
      <ModalAgreement openModal={openModal} handleClose={handleClose} />
    </>
  );
}

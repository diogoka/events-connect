'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useMediaQuery,
  Stack,
  TextField,
  Typography,
  Button,
  FormControl,
  Box,
  Link,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import { UserContext } from '@/context/userContext';
import { LoginStatus } from '@/types/context.types';
import { getErrorMessage } from '@/auth/errors';
import PasswordInput from '@/components/common/password-input';
import NumberTextFieldInput from '@/components/common/noArrowsTextField';
import { deleteAccount } from '@/auth/auth-provider';
import ThreeDots from '@/components/animation/theeDots';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import {
  studentValidation,
  checkPasswords,
} from '@/services/studentValidation';
import { RegisterMessage } from '@/types/alert.types';
import Background from '@/components/registering/background';
import NameInput from '@/components/user/form/name-input';
import { UserInputForm } from '@/types/pages.types';
import CourseInput from '@/components/user/form/course-input';
import ModalAgreement from '@/components/login/modal-agreement';
import { sendUserToServer } from '@/services/sendUserToServer';
import AlertMessage from '@/components/registering/alertMessage';

export default function SignUpPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const {
    setFirebaseAccount,
    loginStatus,
    setLoginStatus,
    firebaseAccount,
    setUser,
  } = useContext(UserContext);

  const [isGoogle, setIsGoogle] = useState<boolean>(false);

  const [userInputForm, setUserInputForm] = useState<UserInputForm>({
    firstName: '',
    lastName: '',
    courseId: '',
    email: '',
    password: '',
    confirmPassword: '',
    student_id: 0,
  });

  const [registerMessage, setRegisterMessage] = useState<RegisterMessage>({
    showMessage: false,
    message: '',
    severity: 'info',
  });

  const [checked, setChecked] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);

  //Modal
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (loginStatus === 'Logged In') {
      router.replace('/events');
    }

    if (firebaseAccount) {
      setIsGoogle(true);
      updateUserInputForm('email', firebaseAccount?.email!);
    }
  }, [loginStatus]);

  const updateUserInputForm = <K extends keyof UserInputForm>(
    key: K,
    value: UserInputForm[K]
  ) => {
    setUserInputForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleMessage = async (
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
      setLoad(false);
      if (navigate) {
        router.replace(navigate);
      }
    }, time * 1000);
  };

  const handleChangeCheckBox = (): void => {
    checked ? setChecked(false) : setChecked(true);
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
          message: `${message}. You are being redirected to Log in. \n Please, select a different email.`,
          severity: 'error',
        },
        5,
        '/login'
      );
    } else {
      handleMessage(
        { showMessage: true, message: message, severity: 'error' },
        4
      );
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoad(true);
    if (!isGoogle) {
      const isPasswordMatch = checkPasswords(
        userInputForm.password!,
        userInputForm.confirmPassword!
      );

      if (!isPasswordMatch) {
        handleMessage(
          {
            showMessage: true,
            message: 'Passwords does not match.',
            severity: 'error',
          },
          4
        );

        return;
      }
    }

    const checkStudentID = await studentValidation(
      userInputForm.email,
      userInputForm.student_id
    );

    if (!checkStudentID.checked) {
      handleMessage(
        {
          showMessage: true,
          message: `${checkStudentID.message}`,
          severity: 'error',
        },
        4
      );
      if (isGoogle) {
        handleCheckError(checkStudentID.code!, checkStudentID.message!);
      }

      return;
    } else {
      if (isGoogle) {
        const { password, confirmPassword, ...rest }: UserInputForm =
          userInputForm;

        const newUser = {
          ...rest,
          id: firebaseAccount?.uid!,
          type: 2,
          provider: firebaseAccount?.providerData![0].providerId!,
          is_verified: false,
          avatarURL: firebaseAccount?.photoURL!,
        };

        try {
          const response = await sendUserToServer(newUser);
          setRegisterMessage({
            showMessage: true,
            message: `${response} Please verify your email. You are being redirected. `,
            severity: 'success',
          });

          setTimeout(() => {
            setRegisterMessage({
              showMessage: false,
              message: '',
              severity: 'info',
            });
            setLoad(false);
            signOut(getAuth());
            setLoginStatus(LoginStatus.LoggedOut);
            router.replace('/login');
          }, 6000);
        } catch (error: any) {
          console.log(error);
          setRegisterMessage({
            showMessage: true,
            message: `${error?.response?.data?.message}.`,
            severity: 'error',
          });

          setTimeout(() => {
            setRegisterMessage({
              showMessage: false,
              message: '',
              severity: 'info',
            });
            setLoad(false);
          }, 6000);
        }
      } else {
        createUserWithEmailAndPassword(
          getAuth(),
          userInputForm.email,
          userInputForm.password!
        )
          .then(async (result) => {
            const { password, confirmPassword, ...rest }: UserInputForm =
              userInputForm;

            const newUser = {
              ...rest,
              id: result.user.uid,
              type: 2,
              provider: result.user.providerData[0].providerId,
              is_verified: false,
              avatarURL: result.user.photoURL!,
            };

            const response = await sendUserToServer(newUser);

            setRegisterMessage({
              showMessage: true,
              message: `${response} Please verify your email. You are being redirected `,
              severity: 'success',
            });

            setTimeout(() => {
              setRegisterMessage({
                showMessage: false,
                message: '',
                severity: 'info',
              });
              setLoad(false);
              signOut(getAuth());
              setLoginStatus(LoginStatus.LoggedOut);
              router.replace('/login');
            }, 6000);
          })
          .catch((error: any) => {
            handleMessage(
              {
                showMessage: true,
                message: `${getErrorMessage(error.code)}`,
                severity: 'error',
              },
              4
            );
          });
      }
    }
  };

  return (
    <>
      {!isMobile && (
        <Background registerMessage={registerMessage} isMobile={isMobile} />
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
          sx={{
            height: isMobile ? 'auto' : '100vh',
            maxHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <Typography
            marginBlock={isMobile ? 'none' : '2rem'}
            variant='h1'
            fontWeight='bold'
          >
            Sign Up
          </Typography>
          {isMobile && (
            <AlertMessage
              registerMessage={registerMessage}
              isMobile={isMobile}
            />
          )}

          {loginStatus === LoginStatus.LoggedOut || isGoogle ? (
            <form onSubmit={handleFormSubmit}>
              <Stack rowGap={'10px'}>
                <NameInput
                  name={userInputForm.firstName}
                  type={'firstName'}
                  setUserName={updateUserInputForm}
                  label='First Name'
                  disabled={registerMessage.showMessage}
                />
                <NameInput
                  name={userInputForm.lastName}
                  type={'lastName'}
                  setUserName={updateUserInputForm}
                  label='Last Name'
                  disabled={registerMessage.showMessage}
                />
                <CourseInput
                  courseId={userInputForm.courseId}
                  type={'courseId'}
                  setCourse={updateUserInputForm}
                  disabled={registerMessage.showMessage}
                />
                <FormControl required>
                  <TextField
                    type='email'
                    label={isGoogle ? firebaseAccount?.email : 'Email'}
                    onChange={(event) =>
                      updateUserInputForm('email', event.target.value)
                    }
                    required
                    disabled={registerMessage.showMessage || isGoogle}
                    InputProps={
                      isGoogle
                        ? {
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Button
                                  sx={{
                                    fontSize: '0.8rem',
                                    height: '2rem',
                                    padding: '0 0.5rem',
                                  }}
                                  variant='contained'
                                  color='primary'
                                  onClick={() => {
                                    setRegisterMessage({
                                      showMessage: true,
                                      message:
                                        'You are being redirected. Select another email.',
                                      severity: 'info',
                                    });

                                    setTimeout(() => {
                                      setRegisterMessage({
                                        showMessage: false,
                                        message: '',
                                        severity: 'info',
                                      });
                                      setUser(null);
                                      setFirebaseAccount(null);
                                      setLoginStatus(LoginStatus.LoggedOut);
                                      router.replace('/login');
                                    }, 6000);
                                  }}
                                  disabled={registerMessage.showMessage}
                                >
                                  Change Email
                                </Button>
                              </InputAdornment>
                            ),
                          }
                        : {}
                    }
                  />
                </FormControl>

                {!isGoogle && (
                  <>
                    <FormControl required>
                      <PasswordInput
                        label='Password'
                        setter={updateUserInputForm}
                        type={'password'}
                        disabled={registerMessage.showMessage || isGoogle}
                      />
                    </FormControl>
                    <FormControl required>
                      <PasswordInput
                        label='Confirm Password'
                        setter={updateUserInputForm}
                        type={'confirmPassword'}
                        disabled={registerMessage.showMessage || isGoogle}
                      />
                    </FormControl>
                  </>
                )}
                <FormControl required>
                  <NumberTextFieldInput
                    label={'Student ID'}
                    maxLength={10}
                    setStudentID={updateUserInputForm}
                    type={'student_id'}
                    disabled={registerMessage.showMessage}
                  />
                </FormControl>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <Checkbox
                    checked={checked}
                    onClick={() => handleChangeCheckBox()}
                    sx={{
                      padding: '0',
                    }}
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
                      onClick={openModal}
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
                disabled={!checked || registerMessage.showMessage}
                sx={{
                  '&:disabled': {
                    cursor: 'not-allowed',
                    pointerEvents: 'auto',
                  },
                }}
              >
                {load ? <ThreeDots color='white' /> : 'Register'}
              </Button>

              <Typography variant='body2' align='center'>
                If you are an organizer, please contact admin:{' '}
                head.tech@ciccc.ca
              </Typography>
            </form>
          ) : (
            <></>
          )}
        </Stack>
      </Box>
      <ModalAgreement openModal={isModalOpen} handleClose={closeModal} />
    </>
  );
}

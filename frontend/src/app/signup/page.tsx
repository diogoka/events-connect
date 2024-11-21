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

import Background from '@/components/registering/background';
import NameInput from '@/components/user/form/name-input';
import { UserInputForm } from '@/types/pages.types';
import CourseInput from '@/components/user/form/course-input';
import ModalAgreement from '@/components/login/modal-agreement';
import { sendUserToServer } from '@/services/sendUserToServer';

import ModalVerifyEmail from '@/components/registering/modalVerifyEmail';
import { useSnack } from '@/context/snackContext';

import Image from 'next/image';

export default function SignUpPage() {
  const isMobile = useMediaQuery('(max-width: 1179px)');
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

  const [checked, setChecked] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);

  //Modal
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [isUserCreated, setIsUserCreated] = useState<boolean>(false);
  const { openSnackbar, isOpen } = useSnack();

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

  const handleChangeCheckBox = (): void => {
    checked ? setChecked(false) : setChecked(true);
  };

  const handleCheckError = async (code: number, message: string) => {
    //code 3 is email is not in the class365

    if (code === 3) {
      setFirebaseAccount(null);
      setLoginStatus(LoginStatus.LoggedOut);
      openSnackbar(
        `${message}. You are being redirected to Log in. \n Please, select a different email.`,
        'error'
      );
      setTimeout(() => {
        router.replace('/login');
      }, 5000);
    } else {
      openSnackbar(message, 'error');
    }
  };

  const handleConfirmModal = () => {
    setTimeout(() => {
      setLoad(false);
      signOut(getAuth());
      setLoginStatus(LoginStatus.LoggedOut);
      router.replace('/login');
    }, 4000);
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
        openSnackbar('Passwords does not match.', 'warning');
        setLoad(false);
        return;
      }
    }

    const checkStudentID = await studentValidation(
      userInputForm.email,
      userInputForm.student_id
    );

    if (!checkStudentID.checked) {
      openSnackbar(`${checkStudentID.message}`, 'error');

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
          await sendUserToServer(newUser);
          setIsUserCreated(true);
        } catch (error: any) {
          openSnackbar(`${error?.response?.data?.message}.`, 'error');
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

            await sendUserToServer(newUser);
            setIsUserCreated(true);
          })
          .catch((error: any) => {
            openSnackbar(`${getErrorMessage(error.code)}`, 'error');
          });
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        {!isMobile && <Background />}
        <Box sx={{ width: isMobile ? '100%' : '50%' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '18px 0',
              background: '#F5F2FA',
            }}
          >
            <Box
              sx={{
                width: {
                  xs: '60%',
                  sm: '40%',
                  md: '30%',
                  lg: '30%',
                  xl: '30%',
                },
              }}
            >
              <Image
                src='/cornerstone-connect-logo-blue-bg-white.svg'
                alt='cornerstone-connect logo'
                width={600}
                height={600}
                priority={true}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Box>

          <Stack
            maxWidth={isMobile ? 'auto' : '100%'}
            marginTop={isMobile ? 0 : 0}
            marginInline={isMobile ? 'auto' : 0}
            sx={{
              maxHeight: '100vh',
              overflowY: 'auto',
              padding: {
                xs: '0 36px',
                sm: '1rem 3rem 2rem 3rem',
                md: '1rem 4rem',
                lg: '2rem 5rem',
              },
            }}
          >
            <Typography
              marginBlock={isMobile ? '2rem' : '2rem'}
              variant='h1'
              fontWeight='bold'
            >
              Create an account
            </Typography>

            {loginStatus === LoginStatus.LoggedOut || isGoogle ? (
              <>
                <form onSubmit={handleFormSubmit}>
                  <Stack rowGap={'12px'} sx={{ marginBottom: '18px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '12px',
                      }}
                    >
                      <NameInput
                        name={userInputForm.firstName}
                        type={'firstName'}
                        setUserName={updateUserInputForm}
                        label='First Name'
                        disabled={isOpen}
                      />
                      <NameInput
                        name={userInputForm.lastName}
                        type={'lastName'}
                        setUserName={updateUserInputForm}
                        label='Last Name'
                        disabled={isOpen}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '12px',
                      }}
                    >
                      <CourseInput
                        courseId={userInputForm.courseId}
                        type={'courseId'}
                        setCourse={updateUserInputForm}
                        disabled={isOpen}
                      />

                      <FormControl required fullWidth>
                        <TextField
                          type='email'
                          label={isGoogle ? firebaseAccount?.email : 'Email'}
                          onChange={(event) =>
                            updateUserInputForm('email', event.target.value)
                          }
                          required
                          disabled={isOpen || isGoogle}
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
                                          openSnackbar(
                                            'You are being redirected. Select another email.',
                                            'info'
                                          );

                                          setTimeout(() => {
                                            setUser(null);
                                            setFirebaseAccount(null);
                                            setLoginStatus(
                                              LoginStatus.LoggedOut
                                            );
                                            router.replace('/login');
                                          }, 6000);
                                        }}
                                        disabled={isOpen}
                                      >
                                        Change
                                      </Button>
                                    </InputAdornment>
                                  ),
                                }
                              : {}
                          }
                        />
                      </FormControl>
                    </Box>

                    {!isGoogle && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: '12px',
                        }}
                      >
                        <FormControl required fullWidth>
                          <PasswordInput
                            label='Password'
                            setter={updateUserInputForm}
                            type={'password'}
                            disabled={isOpen || isGoogle}
                          />
                        </FormControl>
                        <FormControl required fullWidth>
                          <PasswordInput
                            label='Confirm Password'
                            setter={updateUserInputForm}
                            type={'confirmPassword'}
                            disabled={isOpen || isGoogle}
                          />
                        </FormControl>
                      </Box>
                    )}
                    <FormControl required>
                      <NumberTextFieldInput
                        label={'Student ID'}
                        maxLength={10}
                        setStudentID={updateUserInputForm}
                        type={'student_id'}
                        disabled={isOpen}
                      />
                    </FormControl>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: '10px',
                        marginLeft: '6px',
                      }}
                    >
                      <Box>
                        <Checkbox
                          checked={checked}
                          onClick={() => handleChangeCheckBox()}
                          sx={{
                            padding: '0',
                          }}
                        />
                      </Box>

                      <Typography sx={{ fontSize: '15px', lineHeight: '2rem' }}>
                        I acknowledge that I have read and understood the{' '}
                        <Link
                          component='button'
                          type='button'
                          onClick={openModal}
                          sx={{
                            fontSize: '15px',
                            lineHeight: 'inherit',
                            padding: 0,
                            textDecoration: 'underline',
                            verticalAlign: 'baseline',
                            '&:hover': {
                              cursor: 'pointer',
                            },
                          }}
                        >
                          Terms and Conditions
                        </Link>
                        .
                      </Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      disabled={!checked || isOpen}
                      sx={{
                        '&:disabled': {
                          cursor: 'not-allowed',
                          pointerEvents: 'auto',
                        },
                        minWidth: isMobile ? '100%' : '80%',
                        maxWidth: '50%',
                      }}
                    >
                      {load ? <ThreeDots color='white' /> : 'Register'}
                    </Button>
                  </Box>

                  <Typography
                    variant='body2'
                    align='center'
                    sx={{ margin: '1rem 0' }}
                  >
                    If you are an organizer, please contact admin:{' '}
                    head.tech@ciccc.ca
                  </Typography>
                </form>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '18px',
                  }}
                >
                  Have an account? Log in{' '}
                  <Typography
                    component={'a'}
                    onClick={() => {
                      router.push('/login');
                    }}
                    sx={{
                      marginLeft: '2px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    here
                  </Typography>
                  .
                </Box>
              </>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      </Box>
      <ModalAgreement openModal={isModalOpen} handleClose={closeModal} />
      <ModalVerifyEmail
        isOpen={isUserCreated}
        handleConfirm={handleConfirmModal}
      />
    </>
  );
}

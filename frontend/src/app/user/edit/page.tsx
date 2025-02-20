'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
  useTheme,
  Stack,
  Button,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import useUploadImage from '@/services/imageInput';
import { useMediaQuery, Avatar } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { FaCirclePlus } from 'react-icons/fa6';
import NameInput from '@/components/user/form/name-input';
import CourseInput from '@/components/user/form/course-input';
import { storage } from '@/auth/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, UserEditInfo, UserInputForm } from '@/types/pages.types';

export default function UserEditPage() {
  const router = useRouter();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const theme = useTheme();

  const { user, setUser, firebaseAccount } = useContext(UserContext);

  // User Input
  const [courseId, setCourseId] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const { image, warning, onFileInputChange } = useUploadImage(10, 1, 480);
  const [tempImageSrc, setTempImageSrc] = useState(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/img/users/${user?.id}`
  );

  const [userName, setUserName] = useState<UserEditInfo>({
    firstName: '',
    lastName: '',
    courseId: '',
  });

  const updateUserInfo = <K extends keyof UserInputForm>(
    key: K,
    value: UserInputForm[K]
  ) => {
    setUserName((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  let url = firebaseAccount?.photoURL;

  useEffect(() => {
    if (user) {
      updateUserInfo('firstName', user.firstName);
      updateUserInfo('lastName', user.lastName);

      updateUserInfo('courseId', user.courseId.toString());
      setEmail(user.email);
      setPostalCode(user.postalCode);
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (image) {
      setTempImageSrc(URL.createObjectURL(image));
    }
  }, [image]);

  const uploadAvatar = async (image: Blob) => {
    try {
      let url = '';

      const imageRef = ref(storage, `users/${user?.id}`);
      const imageToUpload = image!;

      await uploadBytes(imageRef, imageToUpload).then((response) => {
        return getDownloadURL(response.ref).then((res) => {
          return (url = res);
        });
      });
      return url;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let url: any;

    if (image) {
      url = await uploadAvatar(image!);
    }

    if (!user) {
      return;
    }

    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('type', user.roleId.toString());
    formData.append('courseId', userName.courseId.toString());
    formData.append('email', email);
    formData.append('firstName', userName.firstName);
    formData.append('lastName', userName.lastName);

    if (postalCode) formData.append('postalCode', postalCode);
    if (phone) formData.append('phone', phone);
    if (user.avatarURL) formData.append('avatarURL', user.avatarURL);
    if (image) formData.append('avatarURL', url);

    axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, formData, {
        headers: { 'content-type': 'application/json' },
      })
      .then((res) => {
        setUser(res.data);
        router.push('/user');
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  return (
    <Stack width='100%' marginInline='auto' maxWidth={'375px'}>
      <form onSubmit={handleSubmit}>
        <Stack
          alignItems='center'
          rowGap='24px'
          sx={{
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '24px',
            marginBottom: '90px',
          }}
        >
          {user?.provider === 'google.com' ? (
            <Avatar
              src={`${url}`}
              alt={user?.firstName}
              sx={{
                width: isMobile ? '7.5rem' : '10rem',
                height: isMobile ? '7.5rem' : '10rem',
                fontSize: isMobile ? '3rem' : '4rem',
              }}
            />
          ) : (
            <Box>
              <InputLabel
                htmlFor='avatar'
                style={{
                  position: 'relative',
                }}
              >
                <Avatar
                  src={image ? tempImageSrc : user?.avatarURL}
                  alt={user?.firstName}
                  sx={{
                    width: isMobile ? '7.5rem' : '10rem',
                    height: isMobile ? '7.5rem' : '10rem',
                    fontSize: isMobile ? '3rem' : '4rem',
                  }}
                />

                <Box
                  bgcolor='white'
                  width='2rem'
                  height='2rem'
                  sx={{
                    position: 'absolute',
                    inset: '80% 0 0 80%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                  }}
                >
                  <FaCirclePlus
                    style={{
                      width: '100%',
                      height: '100%',
                      color: theme.palette.primary.main,
                    }}
                  />
                </Box>
              </InputLabel>

              <input
                id='avatar'
                type='file'
                accept='image/*'
                onChange={onFileInputChange}
                style={{ display: 'none' }}
              />
            </Box>
          )}

          <Box
            sx={{
              width: '100%',
              gap: '8px',
              display: 'flex',
              flexDirection: 'column',
              padding: '0 24px',
            }}
          >
            <Typography
              sx={{ fontSize: '13px', fontWeight: 400, color: '#1B1B21' }}
            >
              First name
            </Typography>
            <NameInput
              name={userName.firstName}
              label=''
              type='firstName'
              setUserName={updateUserInfo}
              disabled={false}
            />
            <Typography
              sx={{ fontSize: '13px', fontWeight: 400, color: '#1B1B21' }}
            >
              Last name
            </Typography>
            <NameInput
              name={userName.lastName}
              label=''
              type='lastName'
              setUserName={updateUserInfo}
              disabled={false}
            />
            <Typography
              sx={{ fontSize: '13px', fontWeight: 400, color: '#1B1B21' }}
            >
              Program
            </Typography>

            <CourseInput
              courseId={userName.courseId}
              setCourse={updateUserInfo}
              type='courseId'
              disabled={false}
            />
          </Box>

          <div>{warning}</div>

          <Box
            width='100%'
            display='flex'
            justifyContent='space-between'
            columnGap='1.5rem'
          >
            <Button
              type='submit'
              variant='contained'
              color='primary'
              sx={{ width: '100px', flexGrow: 1, padding: '8px 16px' }}
            >
              Save
            </Button>
            <Button
              variant='outlined'
              sx={{
                width: '100px',
                flexGrow: 1,
                padding: '8px 16px',
                backgroundColor: '#FFDAD6',
                color: '#410002',
                borderColor: '#FFDAD6',
              }}
              onClick={() => router.push('/user')}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}

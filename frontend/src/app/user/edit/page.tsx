'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, Stack, Button, InputLabel, Box } from '@mui/material';
import axios from 'axios';
import useUploadImage from '@/services/imageInput';
import { useMediaQuery, Avatar } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { FaCirclePlus } from 'react-icons/fa6';
import NameInput from '@/components/user/form/name-input';
import CourseInput from '@/components/user/form/course-input';
import { storage } from '@/auth/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User } from '@/types/types';
import { updateFirstName, updateLastName } from '@/common/functions';

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

  const [userName, setUserName] = useState<User>({
    firstName: '',
    lastName: '',
  });

  let url = firebaseAccount?.photoURL;

  useEffect(() => {
    if (user) {
      updateFirstName(user.firstName, setUserName);
      updateLastName(user.lastName, setUserName);
      setEmail(user.email);
      setCourseId(user.courseId.toString());
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

      let reference: any = '';

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

    // If the user wants to update his email, update the email in Firebase, too
    // if (email !== user.email) {
    //   const currentUser = getAuth().currentUser;
    //   if (currentUser) {
    //     try {
    //       await updateEmail(currentUser, "user@example.com");
    //     } catch (error) {
    //       console.error(error);
    //       return;
    //     }
    //   }
    // }

    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('type', user.roleId.toString());
    formData.append('courseId', courseId.toString());
    formData.append('email', email);
    formData.append('firstName', userName.firstName);
    formData.append('lastName', userName.lastName);

    if (postalCode) formData.append('postalCode', postalCode);
    if (phone) formData.append('phone', phone);
    if (image) formData.append('avatarURL', url);

    axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, formData, {
        headers: { 'content-type': 'multipart/form-data' },
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
    <Stack
      width='100%'
      marginInline='auto'
      paddingBlock='4rem'
      maxWidth={'375px'}
    >
      <form onSubmit={handleSubmit}>
        <Stack alignItems='center' rowGap='1rem'>
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

          <NameInput
            name={userName.firstName}
            setName={updateFirstName}
            setUserName={setUserName}
            label=''
          />
          <NameInput
            name={userName.lastName}
            setName={updateLastName}
            setUserName={setUserName}
            label=''
          />

          <CourseInput courseId={courseId} setCourseId={setCourseId} />

          {/* <FormControl required fullWidth>
              <TextField type='email' label='Email' value={email} onChange={(event) => setEmail(event.target.value)} required />
            </FormControl> */}

          <div>{warning}</div>

          <Box
            width='100%'
            display='flex'
            justifyContent='space-between'
            columnGap='1.5rem'
          >
            <Button
              variant='outlined'
              color='error'
              sx={{ width: '100px', flexGrow: 1 }}
              onClick={() => router.push('/user')}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              sx={{ width: '100px', flexGrow: 1 }}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}
